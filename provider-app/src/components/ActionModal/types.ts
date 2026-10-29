export interface ActionModalProps {
  visible: boolean;
  title: string;
  message?: string;
  /** Shows a multiline text input (e.g. for a cancel reason) when provided. */
  reasonValue?: string;
  onReasonChange?: (value: string) => void;
  reasonPlaceholder?: string;
  confirmLabel: string;
  confirmTone?: 'default' | 'danger';
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}
