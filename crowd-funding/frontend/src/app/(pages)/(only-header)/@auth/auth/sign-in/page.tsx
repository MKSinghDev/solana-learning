import { Key, Wallet } from 'lucide-react';

import { DialogClose, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '~/components/ui/dialog';
import SignInButton from '~/lib/auth/components/signin-button';

import CancelButton from '../_components/cancel-button';

const SignInPage = () => (
    <div className="flex flex-col items-center gap-2">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
            <Key className="opacity-80" size={16} />
        </div>
        <DialogHeader>
            <DialogTitle className="sm:text-center">Authentication yourself</DialogTitle>
            <DialogDescription className="sm:text-center">
                You need to authenticate yourself to access the requested page.
            </DialogDescription>
        </DialogHeader>

        <DialogFooter className="items-center mt-4">
            <DialogClose asChild>
                <CancelButton />
            </DialogClose>

            <SignInButton variant="default" insideDialog>
                <Wallet className="mr-1 size-4" />
                Connect Wallet
            </SignInButton>
        </DialogFooter>
    </div>
);

export default SignInPage;
