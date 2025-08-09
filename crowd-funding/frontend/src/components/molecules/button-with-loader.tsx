import { Loader } from 'lucide-react';

import { Button, ButtonProps } from '../ui/button';

interface ButtonWithLoaderProps extends ButtonProps {
    loading?: boolean;
}

const ButtonWithLoader = ({ children, disabled, loading, ...props }: ButtonWithLoaderProps) => {
    return (
        <Button disabled={loading || disabled} {...props}>
            {loading && <Loader className="-ms-1 mr-2 animate-spin" size={16} aria-hidden="true" />}
            {children}
        </Button>
    );
};

export default ButtonWithLoader;
