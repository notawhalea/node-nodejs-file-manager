import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createBrotliDecompress } from 'node:zlib';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleDecompress = async (args, currentCwd) => {
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
                const newFileName = fileName.endsWith('.br') ? fileName.slice(0, -3) : fileName;
                finalDestinationPath = path.join(absoluteDestination, newFileName);
            } else {
                finalDestinationPath = absoluteDestination;
            }
        } catch (e) {
            finalDestinationPath = absoluteDestination;
        }

        if (finalDestinationPath === absoluteSourcePath) {
            console.log('Operation failed: Source and destination paths must be different.');
            return;
        }

        await new Promise((resolve, reject) => {
            const readStream = createReadStream(absoluteSourcePath);
            const brotliStream = createBrotliDecompress();
            const writeStream = createWriteStream(finalDestinationPath);

            readStream
                .pipe(brotliStream)
                .pipe(writeStream);

            readStream.on('error', reject);
            writeStream.on('error', reject);
            brotliStream.on('error', reject);

            writeStream.on('finish', () => {
                console.log(`File decompressed successfully to: ${finalDestinationPath}`);
                resolve();
            });
        });

    } catch (err) {
        operationFailed();
    }
};