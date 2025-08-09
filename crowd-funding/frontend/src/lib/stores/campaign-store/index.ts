import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

import { AccountClient, AnchorProvider, Program, utils, Wallet, web3 } from '@coral-xyz/anchor';
import { clusterApiUrl, ConfirmOptions, Connection, PublicKey } from '@solana/web3.js';
import walletStore from '~/lib/stores/wallet-store';
import idl from '~/lib/program/idl.json';
import { dispatchToast } from '~/lib/message-handler';
import { CrowdFunding } from '~/lib/program/crowd_funding';

enum Messages {
    WALLET_NOT_CONNECTED = 'Wallet not connected',
    PROVIDER_NOTFOUND = 'Provider not found',
}

interface State {
    status: 'idle' | 'success' | 'error' | 'busy';
    network: string;
    opts: ConfirmOptions;
    campaigns?: Array<Awaited<ReturnType<AccountClient<CrowdFunding, 'campaign'>['fetch']>>>;
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
    fetchCampaigns: () => Promise<void>;
}

interface Store extends State, Action {}

const initialState: State = {
    status: 'idle',
    network: clusterApiUrl('devnet'),
    opts: { preflightCommitment: 'finalized' },
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

                    const { network, opts } = get();
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

            fetchCampaigns: async () => {
                try {
                    set(prev => {
                        prev.status = 'busy';
                    });

                    if (walletStore.getState().state !== 'connected') {
                        console.log({ status: 'error', message: Messages.WALLET_NOT_CONNECTED });
                        dispatchToast({
                            type: 'error',
                            message: { title: 'Error', description: Messages.WALLET_NOT_CONNECTED },
                        });
                        return;
                    }

                    const { network, opts } = get();
                    const connection = new Connection(network, opts.preflightCommitment);
                    const provider = get().getProvider();
                    const program = new Program<CrowdFunding>(idl, provider);
                    const campaigns = await Promise.all(
                        (await connection.getProgramAccounts(program.programId)).map(async campaign => ({
                            ...(await program.account.campaign.fetch(campaign.pubkey)),
                            address: campaign.pubkey.toBase58(),
                        }))
                    );
                    console.log({ campaigns });
                    set(prev => {
                        prev.campaigns = campaigns;
                    });
                } catch (error) {
                    console.log(error);
                    dispatchToast({ type: 'error', message: { title: 'Error', description: (error as Error).message } });
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
export const useFetchCampaigns = () => campaignStore(state => state.fetchCampaigns);
export const useGetCampaigns = () => campaignStore(state => state.campaigns);
