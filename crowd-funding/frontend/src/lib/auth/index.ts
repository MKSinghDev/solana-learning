import nextAuth from 'next-auth';
import credentials from 'next-auth/providers/credentials';

import { PublicKey } from '@solana/web3.js';

export const { handlers, signIn, signOut, auth } = nextAuth({
    providers: [
        credentials({
            credentials: {
                address: {},
            },
            async authorize(creds) {
                if (typeof creds.address !== 'string') throw new Error('Invalid address');

                const publicKey = new PublicKey(creds.address);
                if (PublicKey.isOnCurve(publicKey.toBytes())) {
                    return {
                        name: 'Test User',
                        email: `${creds.address.slice(0, 4)}...${creds.address.slice(-4)}`,
                        address: creds.address,
                    };
                }

                throw new Error('Invalid address');
            },
        }),
    ],
    callbacks: {
        authorized: async ({ auth }) => {
            return !!auth;
        },
        jwt({ token, user }) {
            if (user) token.address = user.address;
            return token;
        },
        session({ session, token }) {
            session.user.address = token.address;
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/auth/sign-in',
        error: '/auth/error',
    },
});
