import { PublicKey } from '@solana/web3.js';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Solana } from '~/lib/interfaces/solana';

enum Messages {
    WINDOW_UNDEFINED = "Window doesn't exist",
    WALLET_NOT_INITIALIZED = 'Wallet not initialized',
    WALLET_NOT_INSTALLED = 'Wallet not installed',
    WALLET_NOT_SUPPORTED = 'Wallet not supported',
    WALLET_ALREADY_INITIALIZED = 'Wallet already initialized',
    WALLET_NOT_CONNECTED = 'Wallet not connected',
}

type WalletConnectionStatus = 'idle' | 'success' | 'error' | 'busy';
type WalletConnectionState = 'not-initialized' | 'initialized' | 'connected' | 'disconnected';

type WalletBase =
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
      } & WalletBase)
    | ({
          status: Exclude<WalletConnectionStatus, 'error'>;
          message?: never;
      } & WalletBase);

type InitResponse = { status: 'error'; message: string } | { status: 'success'; address: string };
type ConnectResponse = { status: 'error'; message: string } | { status: 'success'; address: string };

interface WalletAction {
    init: () => Promise<InitResponse>;
    connect: () => Promise<ConnectResponse>;
    disconnect: () => Promise<void>;
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
                        console.log({ status: 'error', message: Messages.WALLET_ALREADY_INITIALIZED });
                        return { status: 'error', message: Messages.WALLET_ALREADY_INITIALIZED };
                    }
                    set(prev => {
                        prev.status = 'busy';
                    });

                    if (typeof window === 'undefined') {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = Messages.WINDOW_UNDEFINED;
                        });
                        return { status: 'error', message: Messages.WINDOW_UNDEFINED };
                    }

                    const { solana } = window;
                    if (!solana) {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = Messages.WALLET_NOT_INSTALLED;
                        });
                        alert('Install Phantom wallet and reload the page');
                        return { status: 'error', message: Messages.WALLET_NOT_INSTALLED };
                    }

                    if (!solana.isPhantom) {
                        set(prev => {
                            prev.status = 'error';
                            prev.message = Messages.WALLET_NOT_SUPPORTED;
                        });
                        return { status: 'error', message: Messages.WALLET_NOT_SUPPORTED };
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
                try {
                    if (get().state === 'not-initialized') {
                        console.log(get().status, get().message);
                        if (get().status === 'error' && get().message === Messages.WALLET_NOT_INSTALLED) {
                            alert('Install Phantom wallet and reload the page');
                            window.location.reload();
                            return { status: 'error', message: Messages.WALLET_NOT_INSTALLED };
                        }
                        alert('Reload the page and try again');
                        window.location.reload();
                        return { status: 'error', message: Messages.WALLET_NOT_INITIALIZED };
                    }

                    set(prev => {
                        prev.status = 'busy';
                    });

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

            disconnect: async () => {
                try {
                    if (get().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        return;
                    }

                    set(prev => {
                        prev.status = 'idle';
                        prev.state = 'disconnected';
                        prev.address = undefined;
                    });
                } catch (error) {
                    console.log(error);
                }
            },
        })),
        { name: 'wallet-store' }
    )
);

export default store;

export const useGetIsConnected = () => store(state => state.state === 'connected');
export const useInitWallet = () => store(state => state.init);
export const useConnectWallet = () => store(state => state.connect);
export const useDisconnectWallet = () => store(state => state.disconnect);
export const useGetState = () => store(state => state.state);
export const useGetAddress = () => store(state => state.address);
