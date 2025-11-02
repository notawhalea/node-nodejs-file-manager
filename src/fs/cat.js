import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';
import { stdout } from 'node:process';

export const handleCat = async (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const filePath = args[0];
    const absolutePath = path.resolve(currentCwd, filePath);

    try {
        const fileStats = await stat(absolutePath);
        if (!fileStats.isFile()) {
            console.log('Operation failed: Path is not a file.');
            return;
        }

        await new Promise((resolve, reject) => {
            const readableStream = createReadStream(absolutePath, { encoding: 'utf-8' });

            readableStream.pipe(stdout);
            readableStream.on('end', () => {
                resolve();
            });

            readableStream.on('error', (err) => {
                reject(err);
            });
        });

    } catch (err) {
        operationFailed();
    }
};