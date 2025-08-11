'use client';

import { usePathname } from 'next/navigation';

import { Dialog } from '~/components/ui/dialog';

const DialogWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    return <Dialog open={pathname.startsWith('/auth/')}>{children}</Dialog>;
};

export default DialogWrapper;
