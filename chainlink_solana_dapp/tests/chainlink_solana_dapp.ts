import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ChainlinkSolanaDapp } from "../target/types/chainlink_solana_dapp";

const CHAINLINK_FEED = "99B2bTijsU6f1GCT73HmdR7HCFFjGMBcPZY6jZ96ynrR";
const CHAINLINK_PROGRAM_ID = "HEvSKofvBgfaexv23kMabbYqxasxU3mQ4ibBMEmJWHny";

describe("chainlink_solana_dapp", () => {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    const program = anchor.workspace.ChainlinkSolanaDapp as Program<ChainlinkSolanaDapp>;

    it("Queries SOL/USD Price Feed", async () => {
        const resultAccount = anchor.web3.Keypair.generate();
        await program.rpc.execute({
            accounts: {
                resultAccount: resultAccount.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: anchor.web3.SystemProgram.programId,
                chainlinkFeed: CHAINLINK_FEED,
                chainlinkProgram: CHAINLINK_PROGRAM_ID,
            },
            signers: [resultAccount]
        });

        const latestPrice = await program.account.resultAccount.fetch(resultAccount.publicKey);
        console.log("Latest price is:", +latestPrice.value / 1_00_000_000);
    })
});
