String.prototype.toCamelCase = function (): string {
    return this.split(' ')
        .map((word, index) => {
            if (index === 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join('');
};

String.prototype.slugify = function (): string {
    return this.toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
};

String.prototype.formattedDate = function (): string {
    const date = new Date(String(this));
    return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });
};

String.prototype.fromCamelToSpaceSeparated = function (): string {
    return this.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
};

String.prototype.fromCamelToSentenceCase = function (): string {
    const sentenceCase = this.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
    return sentenceCase.charAt(0).toUpperCase() + sentenceCase.slice(1);
};

String.prototype.fromSnakeToSentenceCase = function (preserveCaseSubstrings?: string[]): string {
    return this.split('_')
        .map(word => {
            if (preserveCaseSubstrings?.includes(word)) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};

String.prototype.dotNotedToReadable = function (): string {
    return this.split('.')
        .map(s => {
            const withSpaces = s.replace(/([A-Z])/g, ' $1').toLowerCase();
            return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
        })
        .join(' -> ');
};

/**
 * It will initial letter of each word in the string
 * @return {string}
 */
String.prototype.getWordsInitials = function (): string {
    const words = this.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '';
    return words[0][0].toUpperCase() + (words.length > 1 ? words.pop()![0].toUpperCase() : '');
};

/**
 * Returns the last part of the string
 * This is useful for getting the s3 key from the full url
 * @return {string}
 */
String.prototype.getKey = function (): string {
    return this.split('/').at(-1) ?? '';
};

String.prototype.toCryptoAddressView = function (): string {
    return this.slice(0, 4) + '...' + this.slice(-4);
};

export {};
