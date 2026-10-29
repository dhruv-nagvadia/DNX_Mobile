import { Ref } from 'react';
import { TextInput, TextInputProps } from 'react-native';

export interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  /** Helper text under the field. Replaced by the error message when one exists. */
  hint?: string;
  /** Static text inside the field, before the input (e.g. "+91"). */
  prefix?: string;
  /** Drop the default bottom margin — for forms that space fields themselves. */
  dense?: boolean;
  /** Ref to the underlying TextInput, for focus chaining between fields. */
  inputRef?: Ref<TextInput>;
}
