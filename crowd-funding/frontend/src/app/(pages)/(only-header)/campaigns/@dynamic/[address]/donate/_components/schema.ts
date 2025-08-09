import { z } from 'zod';

export const schema = z.object({
    amount: z
        .number({ message: 'Donation amount is required' })
        .min(0.00001, { message: 'Amount must be greater than 0' })
        .max(1_000_000, { message: 'Amount must be less than 1,000,000' }),
});
