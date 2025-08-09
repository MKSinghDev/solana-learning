import { Suspense } from 'react';

import CampaignsList from './_components/campaigns';

const CampaignsPage = () => {
    return (
        <main className="flex flex-col items-center justify-between p-24">
            <Suspense fallback={<div>Loading...</div>}>
                <CampaignsList />
            </Suspense>
        </main>
    );
};

export default CampaignsPage;
