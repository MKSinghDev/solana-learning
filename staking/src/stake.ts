import { Authorized, clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL, Lockup, PublicKey, sendAndConfirmTransaction, StakeProgram } from "@solana/web3.js";
import { style } from "~/lib/style";
import type { StakeInterface } from "~/lib/interface";

export class Stake implements StakeInterface {
    private clusterApiUrl = clusterApiUrl('devnet');
    private connection = new Connection(this.clusterApiUrl, 'confirmed');
    private stakeProgramId = new PublicKey("Stake11111111111111111111111111111111111111");
    private votePubkey = "i7NyKBMJCA9bLM2nsGyAGCKHECuR2L5eh4GqFciuwNT";
    private wallet: Keypair;
    private stakeAccount: Keypair;
    private stakeBalance: number;

    constructor(keypair: Keypair, stakeAccount: Keypair) {
        this.wallet = keypair;
        this.stakeAccount = stakeAccount;
        this.stakeBalance = 0;

        console.group(`${style.BOLD}${style.UNDERLINE}Keypair${style.RESET}:`);
        console.log(`${style.BOLD}${style.CYAN}Wallet:${style.RESET} ${style.YELLOW}${this.wallet.publicKey.toBase58()}${style.RESET}`);
        console.log(`${style.BOLD}${style.CYAN}Stake account:${style.RESET} ${style.YELLOW}${this.stakeAccount.publicKey.toBase58()}${style.RESET}\n`);
        console.groupEnd();
    }

    public run = async () => {
        try {
            await this.getValidators();
            // await this.createStakeAccount(0.2);
            await this.getStakeAccount();
            // await this.delegateStake();
            // await this.getStakeAccount();
            await this.getDelegatorsByValidator();
            await this.deactivateStake();
            await this.withdrawStake();
            await this.getStakeAccount();
        } catch (error) {
            console.log("Error:", error);
        }
    }

    private getValidators = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Validator Stats${style.RESET}:`);
        const { current, delinquent } = await this.connection.getVoteAccounts();

        console.log(`${style.BOLD}${style.CYAN}All validators:${style.RESET} ${style.YELLOW}${current.concat(delinquent).length}${style.RESET}`);
        console.log(`${style.BOLD}${style.GREEN}Current validators:${style.RESET} ${current.length}`);
        console.log(`${style.BOLD}${style.RED}Delinquent validators:${style.RESET} ${delinquent.length}`);
        console.groupEnd();
        console.log('\n');
    }

    private createStakeAccount = async (stake: number) => {
        console.group(`${style.BOLD}${style.UNDERLINE}Stake Account${style.RESET} ${style.BOLD}${style.BLUE}[CREATION]${style.RESET}:`);
        const airdropSignature = await this.connection.requestAirdrop(this.wallet.publicKey, 1 * LAMPORTS_PER_SOL);
        await this.connection.confirmTransaction(airdropSignature);
        console.log(`${style.BOLD}${style.CYAN}Wallet Public Key:${style.RESET} ${style.YELLOW}${this.wallet.publicKey.toBase58()}${style.RESET}`);

        const balance = await this.connection.getBalance(this.wallet.publicKey);
        console.log(`${style.BOLD}${style.CYAN}Wallet Balance:${style.RESET} ${style.YELLOW}${balance / LAMPORTS_PER_SOL} SOL${style.RESET}`);

        const minimumRent = await this.connection.getMinimumBalanceForRentExemption(StakeProgram.space);
        const amountUserWantsToStake = stake * LAMPORTS_PER_SOL;
        const amountToStake = Math.max(minimumRent, amountUserWantsToStake);

        const createStakeAccountTx = StakeProgram.createAccount({
            authorized: new Authorized(this.wallet.publicKey, this.wallet.publicKey),
            fromPubkey: this.wallet.publicKey,
            lamports: amountToStake,
            lockup: new Lockup(0, 0, this.wallet.publicKey),
            stakePubkey: this.stakeAccount.publicKey
        });

        const createStakeAccountTxId = await sendAndConfirmTransaction(this.connection, createStakeAccountTx, [this.wallet, this.stakeAccount]);
        console.log(`${style.BOLD}${style.CYAN}Transaction ID:${style.RESET} ${style.YELLOW}${createStakeAccountTxId}${style.RESET}`);

        this.stakeBalance = await this.connection.getBalance(this.stakeAccount.publicKey);
        console.log(`${style.BOLD}${style.CYAN}Stake Account Balance:${style.RESET} ${style.YELLOW}${this.stakeBalance / LAMPORTS_PER_SOL} SOL${style.RESET}`);
        console.groupEnd();
        console.log('\n');
    }

    private getStakeAccount = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Stake Account${style.RESET} ${style.BOLD}${style.BLUE}[BALANCE]${style.RESET}:`);

        this.stakeBalance = await this.connection.getBalance(this.stakeAccount.publicKey);
        console.log(`${style.BOLD}${style.CYAN}Stake Account Balance:${style.RESET} ${style.YELLOW}${this.stakeBalance / LAMPORTS_PER_SOL} SOL${style.RESET}`);

        const stakeAccountInfo = await this.connection.getParsedAccountInfo(this.stakeAccount.publicKey);
        console.log(`${style.BOLD}${style.CYAN}Stake account info:${style.RESET} ${style.YELLOW}${JSON.stringify(stakeAccountInfo, null, 2)}${style.RESET}`);
        console.groupEnd();
        console.log('\n');
    }

    private delegateStake = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Delegate Stake${style.RESET}:`);

        const validators = await this.connection.getVoteAccounts();
        const selectedValidator = validators.current[0];
        if (!selectedValidator) throw new Error("No validators found");
        const selectedValidatorPubkey = new PublicKey(selectedValidator.votePubkey);
        const delegateStakeTx = StakeProgram.delegate({
            stakePubkey: this.stakeAccount.publicKey,
            authorizedPubkey: this.wallet.publicKey,
            votePubkey: selectedValidatorPubkey,
        });
        const delegateStakeTxId = await sendAndConfirmTransaction(this.connection, delegateStakeTx, [this.wallet]);

        console.log(`${style.BOLD}${style.CYAN}Stake account delegated to:${style.RESET} ${style.YELLOW}${selectedValidatorPubkey.toBase58()}${style.RESET}`);
        console.log(`${style.BOLD}${style.CYAN}Delegate Stake Transaction ID:${style.RESET} ${style.YELLOW}${delegateStakeTxId}${style.RESET}`);
        console.groupEnd();
        console.log('\n');
    }

    private getDelegatorsByValidator = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Delegators by Validator${style.RESET}:`);

        const accounts = await this.connection.getParsedProgramAccounts(this.stakeProgramId, {
            filters: [
                { dataSize: 200 },
                {
                    memcmp: { offset: 124, bytes: this.votePubkey }
                }
            ]
        });

        console.log(`${style.BOLD}${style.CYAN}Total delegators for ${this.votePubkey}:${style.RESET} ${style.YELLOW}${accounts.length}${style.RESET}`);
        if (accounts.length) console.log(`${style.BOLD}${style.CYAN}Sample Delegator:${style.RESET} ${style.YELLOW}${JSON.stringify(accounts[0], null, 2)}${style.RESET}`);

        console.groupEnd();
        console.log('\n');
    }

    private deactivateStake = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Deactivate Stake${style.RESET}:`);

        const deactivateStakeTx = StakeProgram.deactivate({
            stakePubkey: this.stakeAccount.publicKey,
            authorizedPubkey: this.wallet.publicKey,
        });
        const deactivateStakeTxId = await sendAndConfirmTransaction(this.connection, deactivateStakeTx, [this.wallet]);

        console.log(`${style.BOLD}${style.CYAN}Deactivate Stake Transaction ID:${style.RESET} ${style.YELLOW}${deactivateStakeTxId}${style.RESET}`);
        console.groupEnd();
        console.log('\n');
    }

    private withdrawStake = async () => {
        console.group(`${style.BOLD}${style.UNDERLINE}Withdraw Stake${style.RESET}:`);

        const withdrawStakeTx = StakeProgram.withdraw({
            stakePubkey: this.stakeAccount.publicKey,
            authorizedPubkey: this.wallet.publicKey,
            toPubkey: this.wallet.publicKey,
            lamports: this.stakeBalance,
        });
        const withdrawStakeTxId = await sendAndConfirmTransaction(this.connection, withdrawStakeTx, [this.wallet]);

        console.log(`${style.BOLD}${style.CYAN}Withdraw Stake Transaction ID:${style.RESET} ${style.YELLOW}${withdrawStakeTxId}${style.RESET}`);
        console.groupEnd();
        console.log('\n');
    }
}
