import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';
import { cloneGithubTemplate } from '../utils/templateManager';

export async function createProject() {
  let answers;
  try {
    answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'language',
        message: 'Select project language:',
        choices: ['JavaScript', 'TypeScript']
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        default: 'axon-project'
      }
    ]);
  } catch (error) {
    console.log(chalk.magenta('Aborted, Goodbye!'));
    process.exit(1);
  }

  const { language, projectName } = answers;
  const projectDir = path.join(process.cwd(), projectName);

  if (fs.existsSync(projectDir)) {
    console.error(chalk.red(`Directory ${projectName} already exists.`));
    process.exit(1);
  }

  fs.mkdirSync(projectDir);

  const spinner = ora('Cloning template from GitHub...').start();
  try {
    await cloneGithubTemplate(language, projectDir);
    spinner.succeed('Template cloned successfully.');

    const packageJsonPath = path.join(projectDir, 'package.json');
    const packageJson = fs.readJsonSync(packageJsonPath);
    packageJson.name = projectName;
    fs.writeJsonSync(packageJsonPath, packageJson, { spaces: 2 });

    console.log(chalk.green('Base project created successfully using the', language, 'template!'));
    console.log(chalk.blue('✨ Run the following commands to start the project:'));
    console.log(chalk.white(`cd ${projectName}`));
    console.log(chalk.white('npm install'));
    console.log(chalk.white('npm start\n'));
    console.log(chalk.magenta('Happy coding! Thanks for using Axon 🌟❤️'));
  } catch (error) {
    spinner.fail('Template cloning failed.');
    console.error(error);
    process.exit(1);
  }
}
