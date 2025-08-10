import { Stake } from "~/stake";
import { loadOrCreateKeypair } from "~/lib/creds";
import { KEYPAIR_PATH, STAKE_ACCOUNT_PATH } from "~/lib/constants";

const keypair = await loadOrCreateKeypair(KEYPAIR_PATH);
const stakeAccount = await loadOrCreateKeypair(STAKE_ACCOUNT_PATH);

const stake = new Stake(keypair, stakeAccount);
stake.run();

