'use client';

import { Button, ButtonProps } from '~/components/ui/button';
import { useConnectWallet } from '~/lib/stores/wallet-store';
import { cn } from '~/lib/utils';

import { signInWithAddress } from '../action';

const SignInButton = ({ className, children, ...props }: ButtonProps) => {
    const connectWallet = useConnectWallet();
    return (
        <form
            action={async () => {
                const result = await connectWallet();
                if (result.status === 'success') {
                    const address = result.address;
                    signInWithAddress(address);
                }
            }}
        >
            <Button type="submit" className={cn('text-sm shrink-0', className)} variant="ghost" size="sm" {...props}>
                {children ?? 'Sign out'}
            </Button>
        </form>
    );
};

export default SignInButton;
