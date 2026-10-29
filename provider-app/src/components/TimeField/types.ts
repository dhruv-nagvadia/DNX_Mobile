export interface TimeFieldProps {
  label: string;
  /** 24-hour "HH:MM" string, e.g. "09:00". */
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}
