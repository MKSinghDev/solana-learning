'use client';

import { CSSProperties, useId, useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, GripVerticalIcon } from 'lucide-react';

import { BN, web3 } from '@coral-xyz/anchor';
import {
    closestCenter,
    DndContext,
    type DragEndEvent,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { arrayMove, horizontalListSortingStrategy, SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PublicKey } from '@solana/web3.js';
import {
    Cell,
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    Header,
    SortingState,
    useReactTable,
} from '@tanstack/react-table';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import walletStore from '~/lib/stores/wallet-store';

type Item = {
    admin: PublicKey;
    name: string;
    description: string;
    amountDonated: BN;
    address: string;
};

const columns: ColumnDef<Item>[] = [
    {
        id: 'name',
        header: 'Name',
        accessorKey: 'name',
        cell: ({ row }) => <div className="truncate font-medium">{row.getValue('name')}</div>,
        sortUndefined: 'last',
        sortDescFirst: false,
    },
    {
        id: 'description',
        header: 'Description',
        accessorKey: 'description',
        cell: ({ row }) => <div className="truncate font-medium">{row.getValue('description')}</div>,
        sortUndefined: 'last',
        sortDescFirst: false,
    },
    {
        id: 'admin',
        header: 'Admin',
        accessorKey: 'admin',
        cell: ({ row }) => {
            const currentUserAddress = walletStore.getState().address;
            const { admin } = row.original;
            return (
                <div className="truncate inline-flex items-center gap-1">
                    <span className="text-lg leading-none">{admin.toString().toCryptoAddressView()}</span>
                    {admin.toString() === currentUserAddress?.toString() && <Badge>You</Badge>}
                </div>
            );
        },
    },
    {
        id: 'address',
        header: 'Campaign address',
        accessorKey: 'address',
        cell: ({ row }) => (
            <div className="truncate">
                <span className="text-lg leading-none">{row.original.address.toCryptoAddressView()}</span>
            </div>
        ),
    },
    {
        id: 'amountDonated',
        header: 'Amount donated',
        accessorKey: 'amountDonated',
        cell: ({ row }) => {
            const amount = parseFloat(((row.getValue('amountDonated') as number) / web3.LAMPORTS_PER_SOL).toString());
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'SOL',
            }).format(amount);
            return formatted;
        },
    },
];

export default function DataTable({ data }: { data: Item[] }) {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(column => column.id as string));

    const table = useReactTable({
        data,
        columns,
        columnResizeMode: 'onChange',
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onSortingChange: setSorting,
        state: {
            sorting,
            columnOrder,
        },
        onColumnOrderChange: setColumnOrder,
        enableSortingRemoval: false,
    });

    // reorder columns after drag & drop
    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (active && over && active.id !== over.id) {
            setColumnOrder(columnOrder => {
                const oldIndex = columnOrder.indexOf(active.id as string);
                const newIndex = columnOrder.indexOf(over.id as string);
                return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
            });
        }
    }

    const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}));

    return (
        <DndContext
            id={useId()}
            collisionDetection={closestCenter}
            modifiers={[restrictToHorizontalAxis]}
            onDragEnd={handleDragEnd}
            sensors={sensors}
        >
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map(headerGroup => (
                        <TableRow key={headerGroup.id} className="bg-muted/50">
                            <SortableContext items={columnOrder} strategy={horizontalListSortingStrategy}>
                                {headerGroup.headers.map(header => (
                                    <DraggableTableHeader key={header.id} header={header} />
                                ))}
                            </SortableContext>
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map(row => (
                            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                {row.getVisibleCells().map(cell => (
                                    <SortableContext
                                        key={cell.id}
                                        items={columnOrder}
                                        strategy={horizontalListSortingStrategy}
                                    >
                                        <DragAlongCell key={cell.id} cell={cell} />
                                    </SortableContext>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-24 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </DndContext>
    );
}

const DraggableTableHeader = ({ header }: { header: Header<Item, unknown> }) => {
    const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
        id: header.column.id,
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition,
        whiteSpace: 'nowrap',
        width: header.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableHead
            ref={setNodeRef}
            className="before:bg-border relative h-10 border-t before:absolute before:inset-y-0 before:start-0 before:w-px first:before:bg-transparent"
            style={style}
            aria-sort={
                header.column.getIsSorted() === 'asc'
                    ? 'ascending'
                    : header.column.getIsSorted() === 'desc'
                      ? 'descending'
                      : 'none'
            }
        >
            <div className="flex items-center justify-start gap-0.5">
                <Button
                    size="icon"
                    variant="ghost"
                    className="-ml-2 size-7 shadow-none"
                    {...attributes}
                    {...listeners}
                    aria-label="Drag to reorder"
                >
                    <GripVerticalIcon className="opacity-60" size={16} aria-hidden="true" />
                </Button>
                <span className="grow truncate">
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </span>
                <Button
                    size="icon"
                    variant="ghost"
                    className="group -mr-1 size-7 shadow-none"
                    onClick={header.column.getToggleSortingHandler()}
                    onKeyDown={e => {
                        // Enhanced keyboard handling for sorting
                        if (header.column.getCanSort() && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            header.column.getToggleSortingHandler()?.(e);
                        }
                    }}
                >
                    {{
                        asc: <ChevronUpIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                        desc: <ChevronDownIcon className="shrink-0 opacity-60" size={16} aria-hidden="true" />,
                    }[header.column.getIsSorted() as string] ?? (
                        <ChevronUpIcon className="shrink-0 opacity-0 group-hover:opacity-60" size={16} aria-hidden="true" />
                    )}
                </Button>
            </div>
        </TableHead>
    );
};

const DragAlongCell = ({ cell }: { cell: Cell<Item, unknown> }) => {
    const { isDragging, setNodeRef, transform, transition } = useSortable({
        id: cell.column.id,
    });

    const style: CSSProperties = {
        opacity: isDragging ? 0.8 : 1,
        position: 'relative',
        transform: CSS.Translate.toString(transform),
        transition,
        width: cell.column.getSize(),
        zIndex: isDragging ? 1 : 0,
    };

    return (
        <TableCell ref={setNodeRef} className="truncate" style={style}>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
    );
};
