'use client';

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import { AuthProvider } from './AuthProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      {persistor ? (
        <PersistGate loading={null} persistor={persistor}>
          <AuthProvider>{children}</AuthProvider>
        </PersistGate>
      ) : (
        <AuthProvider>{children}</AuthProvider>
      )}
    </Provider>
  );
}
