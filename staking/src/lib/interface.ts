export interface StakeInterface {
    run: () => Promise<void>;
}

export interface CreateStakeAccountProps {
    stake: number;
}
