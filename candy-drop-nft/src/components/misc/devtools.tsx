import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanstackDevtools } from '@tanstack/react-devtools'

const queryClient = new QueryClient()

export default function Devtools() {
    return (
        <QueryClientProvider client={queryClient}>
            <TanstackDevtools
                eventBusConfig={{
                    debug: true,
                }}
                plugins={[
                    {
                        name: 'Tanstack Query',
                        render: <ReactQueryDevtoolsPanel />,
                    },
                    {
                        name: 'Tanstack Router',
                        render: <TanStackRouterDevtoolsPanel />,
                    },
                ]}
            />
        </QueryClientProvider>
    )
}
