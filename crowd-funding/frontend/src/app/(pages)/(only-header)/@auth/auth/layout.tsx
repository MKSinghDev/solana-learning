import { DialogContent } from '~/components/ui/dialog';

import DialogWrapper from './_components/dialog-wrapper';

const AuthLayout = ({ children }: { children: React.ReactNode }) => (
    <DialogWrapper>
        <DialogContent noCloseButton>{children}</DialogContent>
    </DialogWrapper>
);

export default AuthLayout;
