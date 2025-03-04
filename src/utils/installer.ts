import { exec } from 'child_process';

export function installPackages(packages: string[], projectDir: string): Promise<void> {
  // Build a command without specifying version numbers
  const pkgs = packages.join(' ');
  return new Promise((resolve, reject) => {
    // Use dynamic installation: npm install <pkg1> <pkg2> ...
    exec(`npm install ${pkgs}`, { cwd: projectDir }, (error, stdout, stderr) => {
      if (error) {
        return reject(stderr);
      }
      resolve();
    });
  });
}