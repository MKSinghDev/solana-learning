'use client';

import { usePathname, useRouter } from 'next/navigation';

import { Dialog } from '~/components/ui/dialog';

const DialogWrapper = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const pathname = usePathname();
    return (
        <Dialog defaultOpen open={pathname.endsWith('/withdraw')} onOpenChange={() => router.replace('..')}>
            {children}
        </Dialog>
    );
};

export default DialogWrapper;
