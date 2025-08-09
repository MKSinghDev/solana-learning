import { auth } from '..';

const SignedOut = async ({ children }: { children: React.ReactNode }) => {
    const session = await auth();
    return session?.user ? null : children;
};

export default SignedOut;
