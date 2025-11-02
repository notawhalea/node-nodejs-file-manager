import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createBrotliCompress } from 'node:zlib';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleCompress = async (args, currentCwd) => {
    if (args.length !== 2) {
        invalidInput();
        return;
    }

    const [sourcePath, destinationPath] = args;
    const absoluteSourcePath = path.resolve(currentCwd, sourcePath);
    const absoluteDestination = path.resolve(currentCwd, destinationPath);

    let finalDestinationPath;

    try {
        const sourceStats = await stat(absoluteSourcePath);
        if (!sourceStats.isFile()) {
            console.log('Operation failed: Source path is not a file.');
            return;
        }

        const fileName = path.basename(absoluteSourcePath);

        try {
            const destStats = await stat(absoluteDestination);

            if (destStats.isDirectory()) {
                finalDestinationPath = path.join(absoluteDestination, `${fileName}.br`);
            } else {
                finalDestinationPath = absoluteDestination.endsWith('.br')
                    ? absoluteDestination
                    : `${absoluteDestination}.br`;
            }
        } catch (e) {
            finalDestinationPath = absoluteDestination.endsWith('.br')
                ? absoluteDestination
                : `${absoluteDestination}.br`;
        }

        if (finalDestinationPath === absoluteSourcePath) {
            console.log('Operation failed: Source and destination paths must be different.');
            return;
        }

        await new Promise((resolve, reject) => {
            const readStream = createReadStream(absoluteSourcePath);
            const brotliStream = createBrotliCompress();
            const writeStream = createWriteStream(finalDestinationPath);

            readStream
                .pipe(brotliStream)
                .pipe(writeStream);

            readStream.on('error', reject);
            writeStream.on('error', reject);
            brotliStream.on('error', reject);

            writeStream.on('finish', () => {
                console.log(`File compressed successfully to: ${finalDestinationPath}`);
                resolve();
            });
        });

    } catch (err) {
        operationFailed();
    }
};