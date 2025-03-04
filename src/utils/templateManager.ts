import degit from 'degit';
import fs from "fs";
import ejs from "ejs";

/**
 * Clones a GitHub template repository based on the chosen language.
 * @param language - Either 'JavaScript' or 'TypeScript'
 * @param targetDir - Destination directory for the new project
 */
async function cloneGithubTemplate(language: string, targetDir: string): Promise<void> {
  const repo = language === 'TypeScript'
    ? 'AxonJsLabs/Axon-template-ts#main'
    : 'AxonJsLabs/Axon-template-js#main';
    
  const emitter = degit(repo, {
    cache: false,
    force: true,
    verbose: true,
  });
  
  await emitter.clone(targetDir);
}

const generateFile = (templatePath: string, outputPath: string, data: object): void => {
    const templateContent = fs.readFileSync(templatePath, 'utf-8');

    const renderer = ejs.render(templateContent, data);

    fs.writeFileSync(outputPath, renderer, 'utf-8');
}

export {
  generateFile,
  cloneGithubTemplate
}