import path from 'node:path';
import { invalidInput, operationFailed } from '../errors/errors.js';

export const handleCd = (args, currentCwd) => {
    if (args.length !== 1) {
        invalidInput();
        return currentCwd;
    }

    try {
        return path.resolve(currentCwd, args[0]);
    } catch (err) {
        operationFailed();
        return currentCwd;
    }
};