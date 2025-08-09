import { LogOut } from 'lucide-react';

import { Button, ButtonProps } from '~/components/ui/button';
import { cn } from '~/lib/utils';

import { signOut } from '..';

const SignOut = ({ className, children, ...props }: ButtonProps) => (
    <form
        action={async () => {
            'use server';
            await signOut({ redirect: true });
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

export default SignOut;
