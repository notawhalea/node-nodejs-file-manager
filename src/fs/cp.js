import { createReadStream, createWriteStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleCp = async (args, currentCwd) => {
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
                finalDestinationPath = path.join(absoluteDestination, fileName);
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

        await pipeline(
            createReadStream(absoluteSourcePath),
            createWriteStream(finalDestinationPath)
        );
        console.log(`File copied successfully to: ${finalDestinationPath}`);
    } catch (err) {
        operationFailed();
    }
};