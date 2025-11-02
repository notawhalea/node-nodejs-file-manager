import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleHash = async (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const filePath = args[0];
    const absolutePath = path.resolve(currentCwd, filePath);

    try {
        await new Promise((resolve, reject) => {
            const hash = createHash('sha256');
            const stream = createReadStream(absolutePath);

            stream.on('error', reject);
            hash.on('finish', () => {
                console.log(`SHA256 Hash: ${hash.digest('hex')}`);
                resolve();
            });

            stream.pipe(hash);
        });

    } catch (err) {
        operationFailed();
    }
};