/**
 * Formats a product name by replacing underscores with spaces.
 * @param {string} name - The product name to format.
 * @returns {string} The formatted product name.
 */
export const formatName = (name) => {
    if (!name) return '';
    return name.replace(/_/g, ' ');
};
