import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { generateFile } from "../utils/templateManager";
import { findProjectRoot } from "../utils/projectRoot";

export async function makeRouter(name: string) {
    try {
        const currentDir = process.cwd();
        const projectDir = findProjectRoot(currentDir);
        const routersDir = path.join(projectDir, 'src', 'routers');

        let answers;
        try {
            answers = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'language',
                    message: 'Select project language:',
                    choices: ['JavaScript', 'TypeScript']
                }
            ]);
        } catch (error) {
            console.log(chalk.magenta('Aborted. Goodbye!'));
            process.exit(1);
        }

        const { language } = answers;
        const format = language === 'TypeScript' ? 'ts' : 'js';

        const nameParts = name.split('/').filter(part => part.trim() !== '');
        if (nameParts.length === 0) {
            console.error(chalk.red(`❌ Invalid router name: ${name}`));
            process.exit(1);
        }

        const fileName = nameParts.pop()!;
        const directories = nameParts;

        const targetDir = path.join(routersDir, ...directories);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const routerName = `${fileName}.route.${format}`;
        const routerTemplate = path.join(__dirname, 'templates', 'router', `router.${format}.ejs`);
        const routerOutput = path.join(targetDir, routerName);

        if (fs.existsSync(routerOutput)) {
            console.error(chalk.red(`❌ Router '${routerName}' already exists in ${path.relative(projectDir, targetDir)}`));
            process.exit(1);
        }

        generateFile(routerTemplate, routerOutput, { routerName: fileName });

        console.log(chalk.green(`✅ Successfully created ${routerName} in ${path.relative(projectDir, targetDir)}`));
    } catch (error) {
        console.error(chalk.red('❌ Error:', error));
        process.exit(1);
    }
}