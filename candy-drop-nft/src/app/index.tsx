import { createFileRoute, useRouter } from '@tanstack/react-router'
import Home from '~/pages/home'
import { getCount } from '~/pages/home/actions'

export const Route = createFileRoute('/')({
    component: Home,
    loader: async () => await getCount(),
})
