'use client';

import { useRouter } from 'next/navigation';

import { Button, ButtonProps } from '~/components/ui/button';

const CancelButton = (props: ButtonProps) => {
    const router = useRouter();
    return (
        <Button variant="outline" className="flex-1" {...props} onClick={() => router.replace('/')}>
            Cancel
        </Button>
    );
};

export default CancelButton;
