import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleMkdir = async (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const dirName = args[0];
    const absolutePath = path.resolve(currentCwd, dirName);

    try {
        await mkdir(absolutePath, { recursive: true });
        console.log(`Directory created successfully: ${absolutePath}`);

    } catch (err) {
        operationFailed();
    }
};