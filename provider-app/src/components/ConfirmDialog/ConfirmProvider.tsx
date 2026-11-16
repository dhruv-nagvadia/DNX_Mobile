import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { ConfirmDialog } from './ConfirmDialog';
import { ConfirmApi, ConfirmOptions, ConfirmProviderProps, NotifyOptions } from './types';

interface DialogRequest {
  title: string;
  message?: string;
  tone: ConfirmOptions['tone'];
  icon: ConfirmOptions['icon'];
  confirmText: string;
  /** null = single-button notify dialog. */
  cancelText: string | null;
}

const ConfirmContext = createContext<ConfirmApi | null>(null);

/** The mounted provider's API, so non-component code can show a dialog too. */
let activeApi: ConfirmApi | null = null;

/**
 * Hosts the app's single themed `ConfirmDialog`. Mount once near the app
 * root; call sites then use `useConfirm()` (or `confirmDialog`/`notifyDialog`
 * outside components) instead of `Alert.alert`.
 */
export function ConfirmProvider({ children }: ConfirmProviderProps) {
  const [request, setRequest] = useState<DialogRequest | null>(null);
  const [visible, setVisible] = useState(false);
  const resolverRef = useRef<((result: boolean) => void) | null>(null);

  const open = useCallback(
    (next: DialogRequest) =>
      new Promise<boolean>((resolve) => {
        // A new dialog replaces any still-open one, which counts as cancelled.
        resolverRef.current?.(false);
        resolverRef.current = resolve;
        setRequest(next);
        setVisible(true);
      }),
    [],
  );

  const finish = useCallback((result: boolean) => {
    const resolve = resolverRef.current;
    resolverRef.current = null;
    setVisible(false);
    resolve?.(result);
  }, []);

  const api = useMemo<ConfirmApi>(
    () => ({
      confirm: (options: ConfirmOptions) =>
        open({
          title: options.title,
          message: options.message,
          tone: options.tone ?? 'info',
          icon: options.icon,
          confirmText: options.confirmText ?? 'Confirm',
          cancelText: options.cancelText ?? 'Cancel',
        }),
      notify: (options: NotifyOptions) =>
        open({
          title: options.title,
          message: options.message,
          tone: options.tone ?? 'info',
          icon: options.icon,
          confirmText: options.okText ?? 'OK',
          cancelText: null,
        }).then(() => undefined),
    }),
    [open],
  );

  useEffect(() => {
    activeApi = api;
    return () => {
      if (activeApi === api) {
        activeApi = null;
      }
    };
  }, [api]);

  return (
    <ConfirmContext.Provider value={api}>
      {children}
      {request && (
        <ConfirmDialog
          visible={visible}
          title={request.title}
          message={request.message}
          tone={request.tone}
          icon={request.icon}
          confirmText={request.confirmText}
          cancelText={request.cancelText}
          onConfirm={() => finish(true)}
          onCancel={() => finish(false)}
        />
      )}
    </ConfirmContext.Provider>
  );
}

/** `const { confirm, notify } = useConfirm();` — themed `Alert.alert` replacements. */
export function useConfirm(): ConfirmApi {
  const api = useContext(ConfirmContext);
  if (!api) {
    throw new Error('useConfirm must be used inside <ConfirmProvider>');
  }
  return api;
}

/** `confirm` for code outside React components (resolves false if no provider is mounted). */
export function confirmDialog(options: ConfirmOptions): Promise<boolean> {
  return activeApi ? activeApi.confirm(options) : Promise.resolve(false);
}

/** `notify` for code outside React components (no-op if no provider is mounted). */
export function notifyDialog(options: NotifyOptions): Promise<void> {
  return activeApi ? activeApi.notify(options) : Promise.resolve();
}
