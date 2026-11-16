import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react-native';

export type ConfirmTone = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
  visible: boolean;
  title: string;
  message?: string;
  tone?: ConfirmTone;
  /** Overrides the tone's default icon (e.g. Trash2 for a delete). */
  icon?: LucideIcon;
  confirmText?: string;
  /** `null` hides the cancel button (single-button info dialog). */
  cancelText?: string | null;
  /** Shows a spinner on the primary button and blocks dismissal. */
  loading?: boolean;
  /**
   * Render as an absolute overlay instead of in its own Modal — for showing
   * the dialog from inside another Modal (iOS can't stack sibling Modals).
   */
  inline?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ConfirmOptions {
  title: string;
  message?: string;
  /** Default 'Confirm'. */
  confirmText?: string;
  /** Default 'Cancel'. */
  cancelText?: string;
  /** Default 'info'. Use 'danger' for destructive actions. */
  tone?: ConfirmTone;
  icon?: LucideIcon;
}

export interface NotifyOptions {
  title: string;
  message?: string;
  /** Default 'info'. */
  tone?: ConfirmTone;
  icon?: LucideIcon;
  /** Default 'OK'. */
  okText?: string;
}

export interface ConfirmApi {
  /** Resolves true when the primary button is pressed, false on cancel/backdrop/back. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  /** Single-button info dialog; resolves once it is dismissed. */
  notify: (options: NotifyOptions) => Promise<void>;
}

export interface ConfirmProviderProps {
  children?: ReactNode;
}
