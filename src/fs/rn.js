import { rename } from 'node:fs/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleRn = async (args, currentCwd) => {
    if (args.length !== 2) {
        invalidInput();
        return;
    }

    const [oldPath, newFileName] = args;
    const absoluteOldPath = path.resolve(currentCwd, oldPath);
    const absoluteNewPath = path.join(path.dirname(absoluteOldPath), newFileName);

    try {
        await rename(absoluteOldPath, absoluteNewPath);
        console.log(`File successfully renamed from ${oldPath} to ${newFileName}`);
    } catch (err) {
        operationFailed();
    }
};