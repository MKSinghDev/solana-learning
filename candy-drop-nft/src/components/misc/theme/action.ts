import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie, } from "@tanstack/react-start/server";
import { schema, ThemedefinedByMap } from ".";

export const storageKey = "ui-theme";

export const getThemeServerFn = createServerFn().handler(async () => {
    const themeCookie = getCookie(storageKey);

    if (!themeCookie) {
        return null;
    }

    const { success, data } = schema.safeParse(ThemedefinedByMap[themeCookie]);
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
        setCookie(storageKey, data);
    });
