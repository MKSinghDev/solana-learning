// src/routes/__root.tsx
/// <reference types="vite/client" />
import type { ReactNode } from 'react'
import {
    Outlet,
    createRootRoute,
    HeadContent,
    Scripts,
} from '@tanstack/react-router'

import appCss from "~/styles/app.css?url";
import Devtools from '~/components/misc/devtools';
import { getThemeServerFn, ThemeProvider, useTheme } from '~/lib/theme';

export const Route = createRootRoute({
    head: () => ({
        meta: [
            {
                charSet: 'utf-8',
            },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                title: 'TanStack Start Starter - MKSingh',
            },
        ],
        links: [
            {
                rel: "stylesheet",
                href: appCss,
            },
        ],
    }),
    component: RootComponent,
    beforeLoad: async () => await getThemeServerFn(),
    loader: ({ context }) => context?.theme ? context : null,
})

function RootComponent() {
    const themeValue = Route.useLoaderData();
    return (
        <ThemeProvider value={themeValue}>
            <RootDocument>
                <Outlet />
            </RootDocument>
        </ThemeProvider>
    )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
    const { theme } = useTheme();
    return (
        <html className={theme} suppressHydrationWarning>
            <head>
                <HeadContent />
            </head>
            <body>
                {children}
                <Scripts />
                <Devtools />
            </body>
        </html>
    )
}
