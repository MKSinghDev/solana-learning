'use client';

import { useQuery } from '@tanstack/react-query';

import campaignStore from '~/lib/stores/campaign-store';

import DataTable from './table';

const CampaignsList = () => {
    const { data: campaigns, isPending } = useQuery({
        queryKey: ['campaigns'],
        queryFn: campaignStore.getState().getCampaigns,
    });

    if (isPending) return <div>Loading campaigns...</div>;
    if (!campaigns) return <div>No campaigns found</div>;

    return <DataTable data={campaigns} />;
};

export default CampaignsList;
