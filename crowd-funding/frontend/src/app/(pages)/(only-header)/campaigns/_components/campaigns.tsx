'use client';

import { useEffect } from 'react';

import { useFetchCampaigns, useGetCampaigns, useGetStatus } from '~/lib/stores/campaign-store';

const CampaignsList = () => {
    const status = useGetStatus();
    const fetchCampaigns = useFetchCampaigns();
    const campaigns = useGetCampaigns();

    useEffect(() => {
        fetchCampaigns();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (status === 'busy') return <div>Loading campaigns...</div>;
    if (!campaigns) return <div>No campaigns found</div>;

    return <pre>{JSON.stringify(campaigns, null, 2)}</pre>;
};

export default CampaignsList;
