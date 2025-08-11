import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AccountClient, AnchorProvider, BN, Program, utils, Wallet, web3 } from '@coral-xyz/anchor';
import { Connection, PublicKey } from '@solana/web3.js';
import walletStore from '~/lib/stores/wallet-store';
import idl from '~/lib/program/idl.json';
import { dispatchToast } from '~/lib/message-handler';
import { CrowdFunding } from '~/lib/program/crowd_funding';
import { config } from '~/lib/config/solana';

enum Messages {
    WALLET_NOT_CONNECTED = 'Wallet not connected',
    PROVIDER_NOTFOUND = 'Provider not found',
}

type Campaign = Awaited<ReturnType<AccountClient<CrowdFunding, 'campaign'>['fetch']>> & { address: string; balance: number };

interface State {
    status: 'idle' | 'success' | 'error' | 'busy';
}

interface ErrorResponse {
    status: 'error';
    message: string;
}
interface SuccessResponse {
    status: 'success';
    message: string;
}
type Response = ErrorResponse | SuccessResponse;

interface Action {
    getProvider: () => AnchorProvider;
    createCampaign: ({ name, description }: { name: string; description: string }) => Promise<Response>;
    getCampaigns: () => Promise<Array<Campaign>>;
    getCurrentBalance: ({ campaign }: { campaign: string }) => Promise<number>;
    donate: ({ campaign, amount }: { campaign: string; amount: number }) => Promise<Response>;
    withdraw: ({ campaign, amount }: { campaign: string; amount: number }) => Promise<Response>;
}

interface Store extends State, Action {}

const initialState: State = {
    status: 'idle',
};

const campaignStore = create<Store>()(
    devtools(
        immer((set, get) => ({
            ...initialState,
            getProvider: () => {
                try {
                    if (walletStore.getState().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        throw new Error(Messages.WALLET_NOT_CONNECTED);
                    }

                    const { network, opts } = config;
                    const connection = new Connection(network, opts.preflightCommitment);
                    const provider = new AnchorProvider(connection, window.solana as unknown as Wallet, opts);
                    return provider;
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            },

            createCampaign: async ({ name, description }) => {
                try {
                    set(prev => {
                        prev.status = 'busy';
                    });

                    if (walletStore.getState().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        return { status: 'error', message: Messages.WALLET_NOT_CONNECTED };
                    }

                    const provider = get().getProvider();
                    const program = new Program<CrowdFunding>(idl, provider);
                    const [campaign] = await PublicKey.findProgramAddress(
                        [utils.bytes.utf8.encode('CAMPAIGN'), provider.wallet.publicKey.toBuffer()],
                        program.programId
                    );

                    console.log({ name, description, campaign: campaign.toBase58() });
                    await program.rpc.create(name, description, {
                        accounts: {
                            campaign,
                            user: provider.wallet.publicKey,
                            systemProgram: web3.SystemProgram.programId,
                        },
                    });
                    return {
                        status: 'success',
                        message: `Campaign created successfully with address: ${campaign.toBase58()}`,
                    };
                } catch (error) {
                    console.log(error);
                    return { status: 'error', message: (error as Error).message };
                } finally {
                    set(prev => {
                        prev.status = 'idle';
                    });
                }
            },

            getCampaigns: async () => {
                if (walletStore.getState().state !== 'connected') {
                    console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                    dispatchToast({
                        type: 'error',
                        message: { title: 'Error', description: Messages.WALLET_NOT_CONNECTED },
                    });
                    throw new Error(Messages.WALLET_NOT_CONNECTED);
                }

                if (get().status === 'busy') throw new Error('Busy');

                set(prev => {
                    prev.status = 'busy';
                });

                const { network, opts } = config;
                const connection = new Connection(network, opts.preflightCommitment);
                const provider = get().getProvider();
                const program = new Program<CrowdFunding>(idl, provider);
                const campaigns = await Promise.all(
                    (await connection.getProgramAccounts(program.programId)).map(async campaign => ({
                        ...(await program.account.campaign.fetch(campaign.pubkey)),
                        balance: await get().getCurrentBalance({ campaign: campaign.pubkey.toBase58() }),
                        address: campaign.pubkey.toBase58(),
                    }))
                );
                return campaigns;
            },

            getCurrentBalance: async ({ campaign }) => {
                const provider = get().getProvider();
                const balance = await provider.connection.getBalance(new PublicKey(campaign));

                const rentExemptBalance = await provider.connection.getMinimumBalanceForRentExemption(9000); // Your campaign account size
                const availableBalance = balance - rentExemptBalance;

                return Math.max(0, availableBalance); // Don't show negative
            },

            donate: async ({ campaign, amount }) => {
                try {
                    set(prev => {
                        prev.status = 'busy';
                    });
                    if (walletStore.getState().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        return { status: 'error', message: Messages.WALLET_NOT_CONNECTED };
                    }

                    const provider = get().getProvider();
                    const program = new Program<CrowdFunding>(idl, provider);

                    await program.rpc.donate(new BN(amount * web3.LAMPORTS_PER_SOL), {
                        accounts: {
                            campaign: new PublicKey(campaign),
                            user: provider.wallet.publicKey,
                            systemProgram: web3.SystemProgram.programId,
                        },
                    });
                    return {
                        status: 'success',
                        message: `Donation made successfully`,
                    };
                } catch (error) {
                    console.log(error);
                    return { status: 'error', message: (error as Error).message };
                } finally {
                    set(prev => {
                        prev.status = 'idle';
                    });
                }
            },

            withdraw: async ({ campaign, amount }) => {
                try {
                    set(prev => {
                        prev.status = 'busy';
                    });

                    if (walletStore.getState().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        return { status: 'error', message: Messages.WALLET_NOT_CONNECTED };
                    }

                    const provider = get().getProvider();
                    const program = new Program<CrowdFunding>(idl, provider);

                    const res = await program.rpc.withdraw(new BN(amount * web3.LAMPORTS_PER_SOL), {
                        accounts: {
                            campaign: new PublicKey(campaign),
                            user: provider.wallet.publicKey,
                        },
                    });
                    return {
                        status: 'success',
                        message: `Withdrawal made successfully ${res}`,
                    };
                } catch (error) {
                    console.log(error);
                    return { status: 'error', message: (error as Error).message };
                } finally {
                    set(prev => {
                        prev.status = 'idle';
                    });
                }
            },
        })),
        { name: 'campaign-store' }
    )
);

export default campaignStore;

export const useGetStatus = () => campaignStore(state => state.status);
export const useGetProvider = () => campaignStore(state => state.getProvider);
export const useCreateCampaign = () => campaignStore(state => state.createCampaign);
export const useGetCampaigns = () => campaignStore(state => state.getCampaigns);
export const useDonate = () => campaignStore(state => state.donate);
export const useWithdraw = () => campaignStore(state => state.withdraw);
