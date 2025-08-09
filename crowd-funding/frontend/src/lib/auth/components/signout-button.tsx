'use client';

import { LogOut } from 'lucide-react';

import { Button, ButtonProps } from '~/components/ui/button';
import { useDisconnectWallet } from '~/lib/stores/wallet-store';
import { cn } from '~/lib/utils';

import { signOutWallet } from '../action';

const SignOut = ({ className, children, ...props }: ButtonProps) => {
    const disconnectWallet = useDisconnectWallet();
    return (
        <form
            action={async () => {
                await disconnectWallet();
                await signOutWallet();
            }}
        >
            <Button
                type="submit"
                className={cn('shrink-0 whitespace-nowrap h-fit', className)}
                variant="ghost"
                size="sm"
                {...props}
            >
                <LogOut className="mr-2 size-4" />
                {children ?? 'Sign out'}
            </Button>
        </form>
    );
};

export default SignOut;
