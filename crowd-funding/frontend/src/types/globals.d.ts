import { Solana } from '~/lib/interfaces/solana';

export declare global {
    interface Window {
        solana?: { isPhantom: false } | Solana;
    }
}
