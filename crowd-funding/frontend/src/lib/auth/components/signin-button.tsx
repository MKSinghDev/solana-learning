'use client';

import { useSearchParams } from 'next/navigation';

import { Button, ButtonProps } from '~/components/ui/button';
import { DialogClose } from '~/components/ui/dialog';
import { useConnectWallet } from '~/lib/stores/wallet-store';
import { cn } from '~/lib/utils';

import { signInWithAddress } from '../action';

const SignInButton = ({ className, children, insideDialog, ...props }: ButtonProps & { insideDialog?: boolean }) => {
    const connectWallet = useConnectWallet();
    const searchParams = useSearchParams();

    const handleLogin = async () => {
        const result = await connectWallet();
        if (result.status === 'success') {
            const address = result.address;
            await signInWithAddress(address, searchParams.get('callbackUrl') ?? '/');
        }
    };
    return insideDialog ? (
        <DialogClose asChild>
            <Button
                type="submit"
                className={cn('text-sm shrink-0', className)}
                variant="ghost"
                size="sm"
                onClick={handleLogin}
                {...props}
            >
                {children ?? 'Sign out'}
            </Button>
        </DialogClose>
    ) : (
        <Button
            type="submit"
            className={cn('text-sm shrink-0', className)}
            variant="ghost"
            size="sm"
            onClick={handleLogin}
            {...props}
        >
            {children ?? 'Sign out'}
        </Button>
    );
};

export default SignInButton;
