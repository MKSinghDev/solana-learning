import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

import Form from './_components/form';

const NewCampaignPage = () => {
    return (
        <main className="flex flex-col items-center flex-1 w-full">
            <Card className="w-full max-w-sm my-6">
                <CardHeader>
                    <CardTitle>Create new campaign</CardTitle>
                    <CardDescription>Create a new campaign to raise funds</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form />
                </CardContent>
            </Card>
        </main>
    );
};

export default NewCampaignPage;
