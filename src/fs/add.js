import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleAdd = async (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const fileName = args[0];
    const absolutePath = path.resolve(currentCwd, fileName);

    try {
        await writeFile(absolutePath, '', { flag: 'wx' });
        console.log(`File created successfully: ${absolutePath}`);

    } catch (err) {
        operationFailed();
    }
};