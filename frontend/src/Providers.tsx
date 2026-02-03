import { PrivyProvider } from '@privy-io/react-auth';
import React from 'react';

import { baseSepolia } from 'viem/chains';

export default function Providers({ children }: { children: React.ReactNode }) {
    const appId = import.meta.env.VITE_PRIVY_APP_ID || '';

    return (
        <PrivyProvider
            appId={appId}
            config={{
                loginMethods: ['email', 'wallet', 'google'],
                supportedChains: [baseSepolia],
                appearance: {
                    theme: 'dark',
                    accentColor: '#10b981', // Emerald 500
                    logo: 'https://emojicdn.elk.sh/🔒', // Simple placeholder
                },
                embeddedWallets: {
                    createOnLogin: 'users-without-wallets',
                },
            }}
        >
            {children}
        </PrivyProvider>
    );
}
