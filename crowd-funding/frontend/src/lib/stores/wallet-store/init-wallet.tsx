'use client';

import { useInitWallet } from '.';

const InitWallet = () => {
    const initWallet = useInitWallet();
    initWallet();

    return null;
};

export default InitWallet;
