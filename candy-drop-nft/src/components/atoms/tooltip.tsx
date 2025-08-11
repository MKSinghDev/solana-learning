import { TooltipArrow } from '@radix-ui/react-tooltip';

import { Tooltip as TooltipPrimitive, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TooltipProps {
    children: React.ReactNode;
    message: string | React.ReactNode;
    arrow?: boolean;
    hidden?: boolean;
    side?: 'right' | 'left' | 'bottom' | 'top';
    open?: boolean;
    delayDuration?: number;
}

const Tooltip: React.FC<TooltipProps> = ({ children, open, arrow, message, hidden, side, delayDuration }) => (
    <TooltipProvider delayDuration={delayDuration}>
        <TooltipPrimitive open={open}>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent hidden={hidden} side={side}>
                <p>{message}</p>
                {arrow && <TooltipArrow className="fill-foreground" />}
            </TooltipContent>
        </TooltipPrimitive>
    </TooltipProvider>
);

export default Tooltip;
