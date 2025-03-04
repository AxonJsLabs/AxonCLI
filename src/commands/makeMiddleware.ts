import fs from "fs";
import path from "path";
import chalk from "chalk";
import inquirer from "inquirer";
import { generateFile } from "../utils/templateManager";
import { findProjectRoot } from "../utils/projectRoot";

export async function makeMiddleware(name: string) {
    try {
        const currentDir = process.cwd();
        const projectDir = findProjectRoot(currentDir);
        const middlewaresDir = path.join(projectDir, 'src', 'middlewares');

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
            console.error(chalk.red(`❌ Invalid middleware name: ${name}`));
            process.exit(1);
        }

        const fileName = nameParts.pop()!;
        const directories = nameParts;

        const targetDir = path.join(middlewaresDir, ...directories);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const middlewareName = `${fileName}.middleware.${format}`;
        const middlewareTemplate = path.join(__dirname, 'templates', 'middleware', `middleware.${format}.ejs`);
        const middlewareOutput = path.join(targetDir, middlewareName);

        if (fs.existsSync(middlewareOutput)) {
            console.error(chalk.red(`❌ Middleware '${middlewareName}' already exists in ${path.relative(projectDir, targetDir)}`));
            process.exit(1);
        }

        generateFile(middlewareTemplate, middlewareOutput, { middlewareName: fileName });

        const relativePath = path.relative(projectDir, targetDir);
        const successMessage = chalk.green(`✅ Successfully created ${middlewareName} in ${relativePath}`);

        console.log(successMessage);
    } catch (error) {
        console.error(chalk.red('❌ Error:', error));
        process.exit(1);
    }
}