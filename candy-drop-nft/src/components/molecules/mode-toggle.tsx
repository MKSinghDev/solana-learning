import { cva, VariantProps } from 'class-variance-authority';
import { Check, Minus, Monitor, Moon, Sun } from 'lucide-react';

import Tooltip from '~/components/atoms/tooltip';
import { Button, buttonVariants } from '~/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { useTheme } from '~/lib/theme';
import { cn } from '~/lib/utils';

const items = [
    { id: 'radio-18-r3', value: 'system', label: 'System', image: '/images/icons/ui-system.png', icon: Monitor },
    { id: 'radio-18-r1', value: 'light', label: 'Light', image: '/images/icons/ui-light.png', icon: Sun },
    { id: 'radio-18-r2', value: 'dark', label: 'Dark', image: '/images/icons/ui-dark.png', icon: Moon },
] as const;

const toggleVariants = cva('shrink-0', {
    variants: {
        active: {
            false: 'text-muted-foreground',
        },
        size: {
            default: '',
            sm: 'size-6',
            lg: 'size-10',
        },
    },
    defaultVariants: {
        size: 'default',
    },
});

const iconVariants = cva('h-[1.2rem] w-[1.2rem]', {
    variants: {
        size: {
            default: '',
            sm: '!size-3',
            lg: '!size-5',
        },
    },
});

interface ModeToggleProps extends VariantProps<typeof toggleVariants> {
    variant?: 'default' | 'horizontal' | 'image';
    className?: string;
}

export function ModeToggle({ variant = 'default', size = 'default', className }: ModeToggleProps = {}) {
    const { setTheme, theme, definedBy } = useTheme();
    const themeValue = definedBy === 'user' ? theme : 'system';

    switch (variant) {
        case 'image': {
            return (
                <fieldset className="mt-2 space-y-3 px-3 pb-2">
                    <legend className="text-sm font-medium leading-none text-foreground">Choose a theme</legend>
                    <RadioGroup
                        className={cn('flex w-full justify-center gap-3', className)}
                        onValueChange={setTheme}
                        value={themeValue}
                    >
                        {items.map(item => (
                            <Label key={item.id}>
                                <RadioGroupItem
                                    id={item.id}
                                    value={item.value}
                                    checked={item.value === themeValue}
                                    className="peer sr-only after:absolute after:inset-0"
                                />
                                <img
                                    src={item.image}
                                    alt={item.label}
                                    width={45}
                                    height={36}
                                    className="relative cursor-pointer overflow-hidden rounded-lg border border-input shadow-sm shadow-black/5 outline-offset-2 transition-colors peer-[:focus-visible]:outline peer-[:focus-visible]:outline-ring/70 peer-data-[disabled]:cursor-not-allowed peer-data-[state=checked]:border-ring peer-data-[state=checked]:bg-accent peer-data-[disabled]:opacity-50"
                                />
                                <span className="group mt-2 flex items-center gap-1 peer-data-[state=unchecked]:text-muted-foreground/70">
                                    <Check
                                        size={16}
                                        strokeWidth={2}
                                        className="peer-data-[state=unchecked]:group-[]:hidden"
                                        aria-hidden="true"
                                    />
                                    <Minus
                                        size={16}
                                        strokeWidth={2}
                                        className="peer-data-[state=checked]:group-[]:hidden"
                                        aria-hidden="true"
                                    />
                                    <span className="text-xs font-medium">{item.label}</span>
                                </span>
                            </Label>
                        ))}
                    </RadioGroup>
                </fieldset>
            );
        }
        case 'horizontal': {
            return (
                <RadioGroup
                    className={cn('flex w-full gap-3', className)}
                    onValueChange={setTheme}
                    value={themeValue}
                >
                    {items.map(item => (
                        <Tooltip message={item.label} side="top" key={item.id} delayDuration={300}>
                            <Label>
                                <RadioGroupItem
                                    id={item.id}
                                    value={item.value}
                                    checked={item.value === themeValue}
                                    className="peer sr-only after:absolute after:inset-0"
                                    aria-label={item.label}
                                />
                                <span
                                    className={cn(
                                        buttonVariants({
                                            variant: themeValue === item.value ? 'secondary' : 'ghost',
                                            size: 'icon',
                                        }),
                                        toggleVariants({ size, active: themeValue !== item.value }),
                                        'cursor-pointer'
                                    )}
                                >
                                    <item.icon className={cn(iconVariants({ size }))} />
                                </span>
                            </Label>
                        </Tooltip>
                    ))}
                </RadioGroup>
            );
        }
        default: {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="border-none outline-none ring-0" size="icon">
                            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme('light')}>Light</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('dark')}>Dark</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme('system')}>System</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        }
    }
}
