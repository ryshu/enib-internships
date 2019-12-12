export function buildName(firstName: string, lastName: string) {
    if (typeof firstName !== 'string' || firstName.length < 2 || typeof lastName !== 'string') {
        return '';
    }
    return `${firstName[0].toUpperCase()}${firstName
        .slice(1)
        .toLowerCase()} ${lastName.toUpperCase()}`;
}
