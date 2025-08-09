'use server';

import { signIn, signOut } from '.';

export const signInWithAddress = async (address: string) => {
    await signIn('credentials', { address, redirect: true });
};

export const signOutWallet = async () => {
    await signOut({ redirect: true });
};
