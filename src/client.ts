import { createPublicClient, custom, createWalletClient, http } from 'viem';
import { baseSepolia, sepolia } from 'wagmi/chains';

const BASE_SEPOLIA_URL = process.env.REACT_APP_BASE_SEPOLIA_URL;
const SEPOLIA_URL = process.env.REACT_APP_SEPOLIA_URL;

export const baseClient = createPublicClient({
    chain: baseSepolia,
    transport: http(BASE_SEPOLIA_URL),
});

export const sepoliaClient = createPublicClient({
    chain: sepolia,
    transport: http(SEPOLIA_URL),
});

export const walletClient = createWalletClient({
    chain: baseSepolia,
    transport: custom(window.ethereum)
});
