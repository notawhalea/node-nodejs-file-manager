import { EOL, homedir, cpus, userInfo } from 'node:os';
import { arch } from 'node:process';
import { invalidInput } from '../errors/errors.js';

export const handleOs = (args) => {
    if (args.length !== 1) {
        invalidInput();
        return;
    }

    const flag = args[0];

    switch (flag) {
        case '--EOL':
            console.log(`Default System EOL: ${JSON.stringify(EOL)}`);
            break;

        case '--cpus':
            const cpuInfo = cpus();
            console.log(`\nOverall amount of CPUs: ${cpuInfo.length}`);

            cpuInfo.forEach((cpu, index) => {
                const clockRateGHz = (cpu.speed / 1000).toFixed(2);

                console.log(`\n  CPU ${index + 1}:`);
                console.log(`    Model: ${cpu.model.trim()}`);
                console.log(`    Clock rate: ${clockRateGHz} GHz`);
            });
            break;

        case '--homedir':
            console.log(`Home Directory: ${homedir()}`);
            break;

        case '--username':
            console.log(`System User Name: ${userInfo().username}`);
            break;

        case '--architecture':
            console.log(`Architecture: ${arch}`);
            break;

        default:
            invalidInput();
            break;
    }
};