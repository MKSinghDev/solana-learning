import { solanaContext } from '~/client/lib/context/solana';
import { Welcome } from '~/client/welcome/welcome';

import type { Route } from '+appTypes/_main+/+types';

export function meta() {
    return [
        { title: 'Candy Drop NFT - DApp| Developed by MKSingh' },
        { name: 'description', content: 'Candy Drop NFT is a decentralized application developed by MKSingh' },
    ];
}

export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => context.get(solanaContext);

export default function Home() {
    return <Welcome />;
}
