import { useRouter } from "@tanstack/react-router"
import { updateCount } from "./actions"
import { Route } from "~/app"

export default function Home() {
    const router = useRouter()
    const state = Route.useLoaderData()

    return (
        <button
            type="button"
            onClick={() => {
                updateCount({ data: 1 }).then(() => {
                    router.invalidate()
                })
            }}
        >
            Add 1 to {state}?
        </button>
    )
}
