import React, { Fragment } from 'react';

interface Props {
    children: React.ReactNode;
    dynamic: React.ReactNode;
}

const CampaignsLayout = ({ children, dynamic }: Props) => (
    <Fragment>
        {children}
        {dynamic}
    </Fragment>
);

export default CampaignsLayout;
