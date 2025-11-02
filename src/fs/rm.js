import { unlink, stat } from 'node:fs/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleRm = async (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const filePath = args[0];
    const absolutePath = path.resolve(currentCwd, filePath);

    try {
        const fileStats = await stat(absolutePath);
        if (!fileStats.isFile()) {
            console.log('Operation failed: Path is a directory. Use rmdir or similar command for directories.');
            return;
        }

        await unlink(absolutePath);
        console.log(`File successfully removed: ${absolutePath}`);
    } catch (err) {
        operationFailed();
    }
};