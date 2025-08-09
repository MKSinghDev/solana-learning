'use server';

import { signIn } from '.';

export const signInWithAddress = async (address: string) => {
    await signIn('credentials', { address, redirect: true });
};
