import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { generateFile } from "../utils/templateManager";
import { findProjectRoot } from "../utils/projectRoot";

export async function makeController(name: string) {
    try {
        const currentDir = process.cwd();
        const projectDir = findProjectRoot(currentDir);
        const controllersDir = path.join(projectDir, 'src', 'controllers');

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
            console.error(chalk.red(`❌ Invalid controller name: ${name}`));
            process.exit(1);
        }

        const fileName = nameParts.pop()!;
        const directories = nameParts;

        const targetDir = path.join(controllersDir, ...directories);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const controllerName = `${fileName}.controller.${format}`;
        const controllerTemplate = path.join(__dirname, 'templates', 'controller', `controller.${format}.ejs`);
        const controllerOutput = path.join(targetDir, controllerName);

        if (fs.existsSync(controllerOutput)) {
            console.error(chalk.red(`❌ Controller '${controllerName}' already exists in ${path.relative(projectDir, targetDir)}`));
            process.exit(1);
        }

        generateFile(controllerTemplate, controllerOutput, { controllerName: fileName });

        const relativePath = path.relative(projectDir, targetDir);
        const successMessage = chalk.green(`✅ Successfully created ${controllerName} in ${relativePath}`);

        console.log(successMessage);
    } catch (error) {
        console.error(chalk.red('❌ Error:', error));
        process.exit(1);
    }
}