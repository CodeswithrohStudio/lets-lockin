import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const appId = import.meta.env.VITE_PRIVY_APP_ID || '';

    return (
        <PrivyProvider
            appId={appId}
            config={{
                loginMethods: ['email', 'wallet', 'google'],
                appearance: {
                    theme: 'dark',
                    accentColor: '#676FFF',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
