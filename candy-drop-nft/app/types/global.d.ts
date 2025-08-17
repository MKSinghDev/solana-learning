import type { Solana } from '~/lib/context/solana';

declare global {
    interface Window {
        solana: { isPhantom: false } | Solana;
    }
}

export {};
