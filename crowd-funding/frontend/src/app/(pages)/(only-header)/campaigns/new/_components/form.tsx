'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Form as FormPrimitive } from '@base-ui-components/react/form';
import { useForm } from '@conform-to/react';
import { parseWithZod } from '@conform-to/zod/v4';

import FormInput from '~/components/atoms/form-elements/input';
import ButtonWithLoader from '~/components/molecules/button-with-loader';
import { buttonVariants } from '~/components/ui/button';
import { dispatchToast } from '~/lib/message-handler';
import { useCreateCampaign, useGetStatus } from '~/lib/stores/campaign-store';

import { schema } from './schema';

const Form = () => {
    const router = useRouter();
    const status = useGetStatus();
    const createCampaign = useCreateCampaign();
    const [form, fields] = useForm({
        onValidate: ({ formData }) => parseWithZod(formData, { schema }),
        shouldValidate: 'onBlur',
        shouldRevalidate: 'onInput',
        onSubmit: async (e, { formData }) => {
            e.preventDefault();

            const result = parseWithZod(formData, { schema });
            if (result.status === 'success') {
                const res = await createCampaign(result.value);
                dispatchToast({ type: res.status, message: { title: 'Campaign creation', description: res.message } });
                if (res.status === 'success') {
                    router.replace('.');
                }
            }
        },
    });

    return (
        <FormPrimitive id={form.id} onSubmit={form.onSubmit} className="grid gap-4" noValidate>
            <FormInput field={fields.name} label="Campaign name" />
            <FormInput field={fields.description} label="Campaign description" />

            <div className="flex w-full items-center justify-between mt-4">
                <Link href="." className={buttonVariants({ variant: 'secondary' })}>
                    Cancel
                </Link>
                <ButtonWithLoader type="submit" className="w-fit" loading={status === 'busy'}>
                    Create
                </ButtonWithLoader>
            </div>
        </FormPrimitive>
    );
};

export default Form;
