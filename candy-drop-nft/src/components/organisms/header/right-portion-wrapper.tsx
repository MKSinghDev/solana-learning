import { useRouterState } from '@tanstack/react-router';
import clsx from 'clsx';

import { cn } from '~/lib/utils';

const RightPortionWrapper = ({ children }: { children: React.ReactNode }) => {
    const { location: { pathname } } = useRouterState();
    return (
        <div
            className={cn(
                'flex items-center gap-3 shrink-0',
                clsx({ 'max-md:hidden': pathname !== '/', 'ml-auto': pathname === '/' })
            )}
        >
            {children}
        </div>
    );
};

export default RightPortionWrapper;
