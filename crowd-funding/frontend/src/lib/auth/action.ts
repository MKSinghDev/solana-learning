'use server';

import { signIn, signOut } from '.';

export const signInWithAddress = async (address: string, redirectTo: string) => {
    await signIn('credentials', { address, redirectTo });
};

export const signOutWallet = async () => {
    await signOut({ redirect: true, redirectTo: '/' });
};
