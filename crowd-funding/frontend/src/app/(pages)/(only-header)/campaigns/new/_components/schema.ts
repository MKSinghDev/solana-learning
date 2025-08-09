import { z } from 'zod';

export const schema = z.object({
    name: z
        .string({ message: 'Campaign name is required' })
        .min(3, { message: 'Campaign name must be at least 3 characters' })
        .max(50, { message: 'Campaign name must be at most 50 characters' }),
    description: z
        .string({ message: 'Campaign description is required' })
        .min(3, { message: 'Campaign description must be at least 3 characters' })
        .max(50, { message: 'Campaign description must be at most 50 characters' }),
});
