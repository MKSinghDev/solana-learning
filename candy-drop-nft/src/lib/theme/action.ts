import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { schema, ThemedefinedByMap, type ThemeIdentifier } from "./schema";

export const storageKey = "ui-theme";

export const getThemeServerFn = createServerFn().handler(async () => {
    const themeCookie = getCookie(storageKey);

    if (!themeCookie) {
        return null;
    }

    // Type guard to ensure themeCookie is a valid ThemeIdentifier
    if (!(themeCookie in ThemedefinedByMap)) {
        throw new Error("Invalid theme exists");
    }

    const { success, data } = schema.safeParse(ThemedefinedByMap[themeCookie as ThemeIdentifier]);
    if (!success) {
        throw new Error("Invalid theme exists");
    }

    return data;
});

export const setThemeServerFn = createServerFn({ method: "POST" })
    .validator((data: { identifier: keyof typeof ThemedefinedByMap }) => {
        const { success } = schema.safeParse(ThemedefinedByMap[data.identifier]);
        if (!success) {
            throw new Error("Invalid theme provided");
        }
        return data.identifier;
    })
    .handler(async ({ data }) => {
        setCookie(storageKey, data, {
            maxAge: 60 * 60 * 24 * 30 * 12, // 12 months
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
        });
    });