'use client';

import { useEffect } from 'react';

import { useInitWallet } from '.';

const InitWallet = () => {
    const initWallet = useInitWallet();
    useEffect(() => {
        initWallet();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};

export default InitWallet;
