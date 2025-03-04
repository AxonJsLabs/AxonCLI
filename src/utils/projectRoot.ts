import path from "path";
import fs from "fs";

export function findProjectRoot(currentDir: string): string {
    const { root } = path.parse(currentDir);
    let dir = currentDir;

    while (dir !== root) {
        const packagePath = path.join(dir, 'package.json');
        if (fs.existsSync(packagePath)) {
            return dir;
        }
        dir = path.dirname(dir);
    }

    console.error("❌ Could not find project root.");
    process.exit(1);
}