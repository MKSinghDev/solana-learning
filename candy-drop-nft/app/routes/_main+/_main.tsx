import { Outlet } from 'react-router';

import { solanaContext, solanaContextMiddleware } from '~/client/lib/context/solana';

import type { Route } from '+appTypes/_main+/+types/_main';

export const unstable_clientMiddleware = [solanaContextMiddleware];
export const clientLoader = async ({ context }: Route.ClientLoaderArgs) => context.get(solanaContext);
export const HydrateFallback = () => null;

const MainLayout = () => <Outlet />;

export default MainLayout;
