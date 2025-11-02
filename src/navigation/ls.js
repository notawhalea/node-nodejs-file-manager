import { readdir } from 'node:fs/promises';
import { operationFailed } from '../errors/errors.js';

export const handleLs = async (currentCwd) => {
    try {
        const items = await readdir(currentCwd, { withFileTypes: true });

        const result = items
            .filter(item => item.name !== '..')
            .map(item => ({
                Name: item.name,
                Type: item.isDirectory() ? 'directory' : item.isFile() ? 'file' : 'other',
            }))
            .sort((a, b) => {
                const typeOrder = { 'directory': 0, 'file': 1, 'other': 2 };
                const typeComparison = typeOrder[a.Type] - typeOrder[b.Type];

                if (typeComparison !== 0) return typeComparison;

                return a.Name.localeCompare(b.Name);
            });
        console.table(result);

    } catch (err) {
        operationFailed();
    }
};