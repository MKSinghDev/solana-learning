import { Session } from 'next-auth';

import { auth } from '..';

interface SignedInProps {
    children: React.ReactNode | ((session: Session) => React.ReactNode);
}

const SignedIn = async ({ children }: SignedInProps) => {
    const session = await auth();

    if (!session?.user) return null;

    if (typeof children === 'function') return children(session);
    return children;
};

export default SignedIn;
