import { PublicKey } from '@solana/web3.js';

type Connect = ({ onlyIfTrusted }?: { onlyIfTrusted?: boolean }) => Promise<{
    publicKey: PublicKey;
}>;

export interface Solana {
    isPhantom: true;
    publicKey: string;
    connect: Connect;
}
