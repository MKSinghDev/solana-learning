import { describe } from "mocha";
import { assert } from "chai";
import { AnchorProvider, BN, setProvider, web3, workspace } from "@coral-xyz/anchor";

describe('calculator', () => {
    const provider = AnchorProvider.local();
    setProvider(provider);
    const calculator = web3.Keypair.generate();
    const program = workspace['calculator-dapp']

    it('Creates a calculator', async () => {
        await program.rpc.create("Welcome to Solana Calculator", {
            accounts: {
                calculator: calculator.publicKey,
                user: provider.wallet.publicKey,
                systemProgram: web3.SystemProgram.programId
            },
            signers: [calculator]
        })

        const accont = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(accont.greeting === "Welcome to Solana Calculator");
    })

    it("Adds two numbers", async () => {
        await program.rpc.add(new BN(2), new BN(3), {
            accounts: {
                calculator: calculator.publicKey,
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new BN(5)));
    })

    it("Subtracts two numbers", async () => {
        await program.rpc.sub(new BN(5), new BN(1), {
            accounts: {
                calculator: calculator.publicKey,
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new BN(4)));
    })

    it("Multiply two numbers", async () => {
        await program.rpc.mul(new BN(5), new BN(2), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new BN(10)));
    })

    it("Divide two numbers", async () => {
        await program.rpc.div(new BN(56), new BN(5), {
            accounts: {
                calculator: calculator.publicKey
            }
        })

        const account = await program.account.calculator.fetch(calculator.publicKey);
        assert.ok(account.result.eq(new BN(11)));
        assert.ok(account.remainder.eq(new BN(1)));
    })
})
