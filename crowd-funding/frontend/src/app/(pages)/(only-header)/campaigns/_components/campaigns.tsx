'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { useFetchCampaigns, useGetCampaigns, useGetStatus } from '~/lib/stores/campaign-store';

import DataTable from './table';

const CampaignsList = () => {
    const pathname = usePathname();
    const status = useGetStatus();
    const fetchCampaigns = useFetchCampaigns();
    const campaigns = useGetCampaigns();

    useEffect(() => {
        fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (status === 'busy' && pathname.endsWith('/campaigns')) return <div>Loading campaigns...</div>;
    if (!campaigns) return <div>No campaigns found</div>;

    return <DataTable data={campaigns} />;
};

export default CampaignsList;
