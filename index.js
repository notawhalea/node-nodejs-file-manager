import { homedir } from 'node:os';
import { chdir, cwd } from 'node:process';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { handleHash } from "./src/hash/hash.js";
import { handleUp } from "./src/navigation/up.js";
import { handleCd } from "./src/navigation/cd.js";
import { handleLs } from "./src/navigation/ls.js";
import { invalidInput, operationFailed } from "./src/errors/errors.js";
import { handleOs } from "./src/os/os.js";
import { handleCompress } from "./src/zlib/compress.js";
import { handleDecompress } from "./src/zlib/decompress.js";
import { handleCat } from "./src/fs/cat.js";
import { handleMkdir } from "./src/fs/mkdir.js";
import { handleAdd } from "./src/fs/add.js";

const username = getUsername();
const initialCwd = homedir();
let currentCwd = initialCwd;

function getUsername() {
    const usernameArg = process.argv.find(arg => arg.startsWith('--username='));
    if (usernameArg) {
        return usernameArg.split('=')[1] || 'Guest';
    }
    return 'Guest';
}

const printCwd = () => {
    console.log(`\nYou are currently in ${currentCwd}`);
    console.log(`\nPlease enter your command:`);
};

const sayGoodbye = () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
};

const handleInput = async (line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return;

    const parts = trimmedLine.split(/\s+/);
    const command = parts[0];
    const args = parts.slice(1);

    let newCwd = currentCwd;

    switch (command) {
        case '.exit':
            sayGoodbye();
            return;

        case 'up':
            if (args.length !== 0) {
                invalidInput();
            } else {
                newCwd = handleUp(currentCwd);
            }
            break;

        case 'cd':
            newCwd = handleCd(args, currentCwd);
            break;

        case 'ls':
            if (args.length !== 0) invalidInput();
            else await handleLs(currentCwd);
            break;

        case 'add':
            await handleAdd(args, currentCwd);
            break;

        case 'cat':
            await handleCat(args, currentCwd);
            break;

        case 'mkdir':
            await handleMkdir(args, currentCwd);
            break;

        case 'hash':
            await handleHash(args, currentCwd);
            break;

        case 'os':
            handleOs(args);
            break;

        case 'compress':
            await handleCompress(args, currentCwd);
            break;

        case 'decompress':
            await handleDecompress(args, currentCwd);
            break;

        default:
            invalidInput();
            break;
    }

    if (newCwd !== currentCwd) {
        try {
            chdir(newCwd);
            currentCwd = newCwd;
        } catch (err) {
            operationFailed();
        }
    }
};

try {
    chdir(initialCwd);
    currentCwd = cwd();
} catch (err) {
    console.error(`Could not change to initial directory: ${initialCwd}`);
    process.exit(1);
}

console.log(`Welcome to the File Manager, ${username}!`);
printCwd();

const rl = readline.createInterface({ input, output });

rl.on('line', async (line) => {
    await handleInput(line);
    printCwd();
});

rl.on('SIGINT', sayGoodbye);