import React from 'react';

interface Props {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

export default function AuthGuard({ isAuthenticated, children }: Props) {
  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return <>{children}</>;
}