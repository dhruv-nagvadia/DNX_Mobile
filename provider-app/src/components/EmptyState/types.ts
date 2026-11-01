import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}
