import { Wallet } from 'lucide-react';

import { ModeToggle } from '~/components/molecules/mode-toggle';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

import UserAvatar from './avatar';
import NonSelectableMenuItem from './non-selectable-menuitem';
import { Link } from '@tanstack/react-router';
import { Button } from '~/components/ui/button';

const UserMenu = () => (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <UserAvatar notificationsCount={0} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="max-w-64">
            <DropdownMenuLabel className="flex min-w-0 flex-col">
                <span className="text-foreground truncate text-sm font-medium">{'user?.email'}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                    <Link to="/">
                        <Wallet size={16} className="opacity-60" aria-hidden="true" />
                        <span>Wallet</span>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="space-y-1">
                <NonSelectableMenuItem asChild className="p-0">
                    <Button className="px-2 [&_svg]:opacity-60 [&_svg]:mr-1.5 text-sm py-1.5 justify-start h-full w-full">
                        Disconnect
                    </Button>
                </NonSelectableMenuItem>
                <NonSelectableMenuItem asChild>
                    <div className="flex items-center justify-center gap-2">
                        <ModeToggle size="sm" variant="horizontal" className="w-fit" />
                    </div>
                </NonSelectableMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
);

export default UserMenu;
