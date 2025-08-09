import { BanknoteArrowUp } from 'lucide-react';

import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '~/components/ui/dialog';

import DialogWrapper from './_components/dialog-wrapper';
import Form from './_components/form';

const DonatePage = () => {
    return (
        <DialogWrapper>
            <DialogContent>
                <div className="flex flex-col items-center gap-2">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full border" aria-hidden="true">
                        <BanknoteArrowUp className="opacity-80" size={16} />
                    </div>
                    <DialogHeader>
                        <DialogTitle className="sm:text-center">Final confirmation</DialogTitle>
                        <DialogDescription className="sm:text-center">
                            This action cannot be undone. So please be sure before you donate.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Form />
            </DialogContent>
        </DialogWrapper>
    );
};

export default DonatePage;
