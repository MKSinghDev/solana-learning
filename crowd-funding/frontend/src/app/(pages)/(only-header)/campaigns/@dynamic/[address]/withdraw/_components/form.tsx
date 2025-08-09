'use client';

import { useParams, useRouter } from 'next/navigation';

import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';

import FormInput from '~/components/atoms/form-elements/input';
import ButtonWithLoader from '~/components/molecules/button-with-loader';
import { Button } from '~/components/ui/button';
import { DialogClose, DialogFooter } from '~/components/ui/dialog';
import { dispatchToast } from '~/lib/message-handler';
import { useFetchCampaigns, useGetStatus, useWithdraw } from '~/lib/stores/campaign-store';

import { schema } from './schema';

const Form = () => {
    const { address } = useParams<{ address: string }>();
    const router = useRouter();
    const status = useGetStatus();
    const withdraw = useWithdraw();
    const reFetchCampaigns = useFetchCampaigns();
    const [form, fields] = useForm({
        shouldValidate: 'onSubmit',
        shouldRevalidate: 'onInput',
        onValidate: ({ formData }) => parseWithZod(formData, { schema }),
        onSubmit: async (e, { formData }) => {
            e.preventDefault();

            const result = parseWithZod(formData, { schema });
            if (result.status !== 'success') return;

            const res = await withdraw({ campaign: address, amount: result.value.amount });
            dispatchToast({
                type: res.status,
                message: res.message,
            });

            await reFetchCampaigns();
            if (res.status === 'success') router.push('..');
        },
    });

    return (
        <form className="space-y-5" id={form.id} onSubmit={form.onSubmit}>
            <FormInput
                field={fields.amount}
                label="Withdrawal amount"
                placeholder="Enter amount"
                disabled={status === 'busy'}
            />
            <DialogFooter className="items-center">
                <DialogClose asChild>
                    <Button variant="outline" className="flex-1" disabled={status === 'busy'}>
                        Cancel
                    </Button>
                </DialogClose>
                <ButtonWithLoader type="submit" loading={status === 'busy'} className="flex-1" size="sm">
                    Withdraw
                </ButtonWithLoader>
            </DialogFooter>
        </form>
    );
};

export default Form;
