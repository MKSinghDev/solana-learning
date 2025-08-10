import { Keypair } from "@solana/web3.js";
import { promises as fs } from "fs";

export const loadOrCreateKeypair = async (filePath: string): Promise<Keypair> => {
    try {
        const data = await fs.readFile(filePath, "utf-8");
        const secretKey = Uint8Array.from(JSON.parse(data));
        return Keypair.fromSecretKey(secretKey);
    } catch {
        const keypair = Keypair.generate();
        await fs.writeFile(filePath, JSON.stringify(Array.from(keypair.secretKey)), "utf-8");
        return keypair;
    }
}
