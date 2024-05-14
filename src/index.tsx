import React from 'react';
import ReactDOM from 'react-dom/client';

import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';
import './index.css';

import { WagmiProvider, http } from 'wagmi';
import {baseSepolia, sepolia} from 'wagmi/chains';

import App from './App';
import SCI from './contract-interaction';


const WALLETCONNECT_ID = process.env.REACT_APP_WALLETCONNECT_ID!;
const BASE_SEPOLIA_URL = process.env.REACT_APP_BASE_SEPOLIA_URL;
const SEPOLIA_URL = process.env.REACT_APP_SEPOLIA_URL;

const config = getDefaultConfig({
  appName: 'RainbowKit demo',
  projectId: WALLETCONNECT_ID,
  chains: [baseSepolia, sepolia],
  transports: {
    [baseSepolia.id]: http(BASE_SEPOLIA_URL),
    [sepolia.id]: http(SEPOLIA_URL),
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const queryClient = new QueryClient();

root.render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">
          <App />
          <SCI />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);