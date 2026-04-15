'use client';

import { useSyncExternalStore } from 'react';
import { ToastContainer } from 'react-toastify';

const emptySubscribe = () => () => {};

export function AppToaster() {
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isClient) {
    return null;
  }

  return <ToastContainer />;
}
