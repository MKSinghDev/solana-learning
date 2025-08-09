declare global {
    interface String {
        formattedDate(): string;
        toShortDateTime(): string;
        slugify(): string;
        toCamelCase(): string;
        fromCamelToSpaceSeparated(): string;
        fromCamelToSentenceCase(): string;
        fromSnakeToSentenceCase(preserveCaseSubstrings?: string[]): string;
        dotNotedToReadable(): string;
        getWordsInitials(): string;
        getKey(): string;
        toCryptoAddressView(): string;
    }
}

export {};
