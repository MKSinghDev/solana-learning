import { clusterApiUrl, ConfirmOptions } from '@solana/web3.js';

export const config = {
    network: clusterApiUrl('devnet'),
    opts: { preflightCommitment: 'finalized' },
} satisfies {
    network: string;
    opts: ConfirmOptions;
};
