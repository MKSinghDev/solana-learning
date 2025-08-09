import { PublicKey } from '@solana/web3.js';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Solana } from '~/lib/interfaces/solana';

enum WalletInitMessage {
    WINDOW_UNDEFINED = "Window doesn't exist",
    WALLET_NOT_INITIALIZED = 'Wallet not initialized',
    WALLET_NOT_INSTALLED = 'Wallet not installed',
    WALLET_NOT_SUPPORTED = 'Wallet not supported',
    WALLET_ALREADY_INITIALIZED = 'Wallet already initialized',
}

type WalletConnectionStatus = 'idle' | 'success' | 'error' | 'busy';
type WalletConnectionState = 'not-initialized' | 'initialized' | 'connected' | 'disconnected';

type WalletExtension =
    | {
          state: Exclude<WalletConnectionState, 'connected'>;
          address?: never;
      }
    | {
          state: 'connected';
          address: PublicKey;
      };

type WalletState =
    | ({
          status: 'error';
          message: string;
      } & WalletExtension)
    | ({
          status: Exclude<WalletConnectionStatus, 'error'>;
          message?: never;
      } & WalletExtension);

type InitResponse = { status: 'error'; message: string } | { status: 'success'; address: string };
type ConnectResponse = { status: 'error'; message: string } | { status: 'success'; address: string };

interface WalletAction {
    init: () => Promise<InitResponse>;
    connect: () => Promise<ConnectResponse>;
}

type WalletStore = WalletState & WalletAction;

const initialState: WalletState = {
    status: 'idle',
    state: 'not-initialized',
};

const store = create<WalletStore>()(
    devtools(
        immer((set, get) => ({
            ...initialState,
            init: async () => {
                try {
                    if (get().state !== 'not-initialized') {
                        console.log({ status: 'error', message: WalletInitMessage.WALLET_ALREADY_INITIALIZED });
                        return { status: 'error', message: WalletInitMessage.WALLET_ALREADY_INITIALIZED };
                    }
                    set(prev => {
                        prev.status = 'busy';
                    });

                    if (typeof window === 'undefined') {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = WalletInitMessage.WINDOW_UNDEFINED;
                        });
                        return { status: 'error', message: WalletInitMessage.WINDOW_UNDEFINED };
                    }

                    const { solana } = window;
                    if (!solana) {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = WalletInitMessage.WALLET_NOT_INSTALLED;
                        });
                        return { status: 'error', message: WalletInitMessage.WALLET_NOT_INSTALLED };
                    }

                    if (!solana.isPhantom) {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = WalletInitMessage.WALLET_NOT_SUPPORTED;
                        });
                        return { status: 'error', message: WalletInitMessage.WALLET_NOT_SUPPORTED };
                    }

                    set(prev => {
                        prev.state = 'initialized';
                    });
                    const res = await solana.connect({ onlyIfTrusted: true });
                    console.log('Phantom wallet connected', res);

                    set(prev => {
                        prev.status = 'success';
                        prev.state = 'connected';
                        prev.address = res.publicKey;
                        prev.message = undefined;
                    });

                    return { status: 'success', address: res.publicKey.toBase58() };
                } catch (error) {
                    set(prev => {
                        prev.status = 'error';
                        prev.message = (error as Error).message;
                    });
                    console.log(error);
                    return { status: 'error', message: (error as Error).message };
                }
            },

            connect: async () => {
                set(prev => {
                    prev.status = 'busy';
                });
                try {
                    if (get().state === 'not-initialized') {
                        console.log({ status: 'error', message: WalletInitMessage.WALLET_NOT_INITIALIZED });
                        return { status: 'error', message: WalletInitMessage.WALLET_NOT_INITIALIZED };
                    }

                    const { solana } = window as { solana: Solana };
                    const res = await solana.connect();
                    console.log('Phantom wallet connected', res);

                    set(prev => {
                        prev.status = 'success';
                        prev.message = undefined;
                        prev.state = 'connected';
                        prev.address = res.publicKey;
                    });

                    return { status: 'success', address: res.publicKey.toBase58() };
                } catch (error) {
                    set(prev => {
                        prev.status = 'error';
                        prev.message = (error as Error).message;
                    });
                    console.log(error);
                    return { status: 'error', message: (error as Error).message };
                }
            },
        })),
        { name: 'wallet-store' }
    )
);

export const useGetIsConnected = () => store(state => state.state === 'connected');
export const useInitWallet = () => store(state => state.init);
export const useConnectWallet = () => store(state => state.connect);
export const useGetState = () => store(state => state.state);
export const useGetAddress = () => store(state => state.address);
