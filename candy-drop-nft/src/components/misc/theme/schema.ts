import { z } from "zod";

export const ThemedefinedByMap = Object.freeze({
    ud: { definedBy: 'user', theme: 'dark' },
    sd: { definedBy: 'system', theme: 'dark' },
    ul: { definedBy: 'user', theme: 'light' },
    sl: { definedBy: 'system', theme: 'light' },
});

export type ThemeIdentifier = keyof typeof ThemedefinedByMap;

// NOTE: Default to sd
export const schema = z.object({
    theme: z.enum(["dark", "light"]).optional().default('dark'),
    definedBy: z.enum(['user', 'system']).optional().default('system'),
});

export type ThemeType = z.infer<typeof schema>;

