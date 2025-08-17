import { redirect, unstable_createContext } from 'react-router';

import type { PublicKey } from '@solana/web3.js';

import type { Route } from '+appTypes/_main+/+types/_main';

export interface Solana {
    isPhantom: true;
    connect: (args?: { onlyIfTrusted?: boolean }) => Promise<void>;
    isConnected: boolean;
    publicKey: PublicKey;
    disconnect: () => void;
}

export const solanaContext = unstable_createContext<Solana>();

export const solanaContextMiddleware: Route.unstable_ClientMiddlewareFunction = async ({ context }, next) => {
    if (!window.solana) throw redirect('/errors/solana/404');
    if (!window.solana.isPhantom) throw redirect('/errors/solana/phantom/404');

    try {
        if (!window.solana.isConnected) await window.solana.connect({ onlyIfTrusted: true });
    } catch {
        try {
            await window.solana.connect();
        } catch {
            throw redirect('/errors/solana/phantom/401');
        }
    }

    context.set(solanaContext, window.solana);
    await next();
};
