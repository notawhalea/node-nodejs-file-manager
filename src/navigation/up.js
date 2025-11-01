import path from 'node:path';
import { operationFailed } from '../errors/errors.js';

export const handleUp = (currentCwd) => {
    try {
        return path.resolve(currentCwd, '..');
    } catch (err) {
        operationFailed();
        return currentCwd;
    }
};