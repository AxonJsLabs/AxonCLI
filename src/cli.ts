#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { createProject } from './commands/createProject';
import { makeController } from './commands/makeController';
import { makeMiddleware } from './commands/makeMiddleware';
import { makeRouter } from './commands/makeRouter';
import { routeList } from './commands/routeList';
// import { createApi } from './commands/createApi';
// import { listRoutes } from './commands/listRoutes';

interface Commands {
  [key: string]: string;
}

const createCommands: Commands = {
  project: "Scaffold a new AxonJs project with MVC structure"
}

const makeCommands: Commands = {
  controller: "Create a controller in src/controllers",
  middleware: "Create a middleware in src/middlewares",
  router: "Create a router in src/routers"
}

const program = new Command();

program
  .name('axon')
  .description('A complete tool for managing AxonJs projects')
  .usage('<command> [options]')
  .helpOption('-h, --help', 'Display help for command')
  .version('0.1.0');

program
  .command('create')
  .description('List of `create` commands')
  .action(() => {
    console.log(chalk.yellow('Available `create` commands:'));

    Object.keys(createCommands).forEach(cmd => {
      console.log(chalk.green(`- ${cmd}: `) + chalk.white(createCommands[cmd]));
    });
  });

program
  .command('make')
  .description('List of `make` commands')
  .action(() => {
    console.log(chalk.yellow('Available `make` commands:'));

    Object.keys(makeCommands).forEach(cmd => {
      console.log(chalk.green(`- ${cmd}: `) + chalk.white(makeCommands[cmd]));
    });
  });

// Command: Create project
program
  .command('create:project')
  .description(createCommands.project)
  .action(createProject);

// Command: Create controller
program
  .command('make:controller <name>')
  .description(makeCommands.controller)
  .action(makeController);

// Command: Create middleware
program
  .command('make:middleware <name>')
  .description(makeCommands.middleware)
  .action(makeMiddleware);

// Command: Create router
program
  .command('make:router <name>')
  .description(makeCommands.router)
  .action(makeRouter);

program
  .command('route:list')
  .description('List all routes in the project')
  .action(routeList);

// // Command: Create API (router, controller, middleware)
// program
//   .command('create:api <name>')
//   .description('Create API components for a resource')
//   .action(createApi);

program.parse(process.argv);
