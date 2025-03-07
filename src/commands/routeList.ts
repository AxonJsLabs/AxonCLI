// libs
import { readFileSync } from 'fs';
// import { transformSync } from "esbuild";
import esbuild from "esbuild";
import { pathToFileURL } from "url";
import { AxonRouter } from "@axonlabs/core";
import path from "path";
import fs from "fs/promises";
import Table from "cli-table3";
import chalk from "chalk";
import { createRequire } from "module";

// types
import type { ChalkInstance as Chalk } from "chalk";

// utils
import { findProjectRoot } from "../utils/projectRoot";

// Route Type Definitions
interface RouteObject {
    file: string;
    routes: Record<string, Record<string, Function>>;
}

interface RouteEntry {
    method: string;
    route: string;
    file: string;
}

const loadJSFile = async (filePath: string) => {
    const fileUrl = pathToFileURL(filePath).href;
    const module = await import(fileUrl);
    return module.default || module;
}

const loadTSFile = async (filePath: string) => {
    const result = await esbuild.build({
        entryPoints: [filePath],
        bundle: true,
        external: ["esbuild"],
        platform: 'node',
        format: 'cjs',
        target: 'es2020',
        write: false,
    });
    const code = result.outputFiles[0].text;
    const module = { exports: {} };
    const fn = new Function('module', 'exports', 'require', code);
    fn(module, module.exports, require);
    return module.exports;
};

/**
 * Loads a JavaScript/TypeScript file dynamically
 * @param {Array<string>} file - The file path
 * @returns {Promise<any>} - The loaded module
 */
async function loadFile(file: Array<string>): Promise<any> {
    if (file[1] === "ts") {
        return await loadTSFile(file[0]);
    } else {
        return await loadJSFile(file[0]);
    }
}

/**
 * Recursively searches for route files
 * @param {string} dir - Directory to search
 * @returns {Promise<string[]>} - Array of file paths
 */
const findRouteFiles = async (dir: string): Promise<Array<string>[]> => {
    let files: Array<string>[] = [];
    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...(await findRouteFiles(fullPath)));
            } else if (entry.isFile() && /\.(route\.(ts))$/i.test(entry.name)) {
                files.push([fullPath, "ts"])
            } else if (entry.isFile() && /\.(route\.(js|mjs|cjs))$/i.test(entry.name)) {
                files.push([fullPath, "js"]);
            }
        }
    } catch {
        // Ignore if the directory does not exist
    }
    return files;
};

/**
 * Loads and extracts route data from a file
 * @param {string} filePath - The file path
 * @returns {Promise<RouteObject>} - Object containing file and its routes
 */
const loadRouteObject = async (file: Array<string>): Promise<RouteObject> => {
    try {
        const router = await loadFile(file);

        let exportedRoutes: Record<string, any> = {};

        if (typeof router !== "object" || router === null) {
            return { file: file[0], routes: {} };
        }

        const proto = Object.getPrototypeOf(router);
        if (proto && proto.constructor.name === "AxonRouter") {
            return { file: file[0], routes: router.exportRoutes() as any };
        }

        Object.values(router).forEach((item) => {
            if (typeof item === "object" && item !== null) {
                const itemProto = Object.getPrototypeOf(item);
                if (itemProto && itemProto.constructor.name === "AxonRouter") {
                    exportedRoutes = { ...exportedRoutes, ...(item as AxonRouter).exportRoutes() };
                }
            }
        });

        return { file: file[0], routes: exportedRoutes };
    } catch (err) {
        // console.error(`Error loading route ${file[0]}:\n`, err);
        return { file: file[0], routes: {} };
    }
};

/**
 * Fetches all route files and extracts their routes
 * @returns {Promise<RouteObject[]>} - Array of route objects
 */
const routesList = async (): Promise<RouteObject[]> => {
    try {
        const baseDirs = ["src/routers", "routers"];
        const currentDir = process.cwd();
        const projectRoot = findProjectRoot(currentDir);

        let allFiles: Array<string>[] = [];

        for (const baseDir of baseDirs) {
            const foundFiles = await findRouteFiles(path.resolve(projectRoot, baseDir));
            allFiles.push(...foundFiles);
        }

        return await Promise.all(allFiles.map((file) => loadRouteObject(file)));
    } catch (err) {
        // console.error("Error loading routes:\n", err);
        return [];
    }
};

// HTTP methods with colors
const methodColors: Record<string, Chalk> = {
    GET: chalk.green.bold,
    POST: chalk.yellow.bold,
    PUT: chalk.blue.bold,
    PATCH: chalk.magenta.bold,
    DELETE: chalk.red.bold,
    OPTIONS: chalk.cyan.bold
};

/**
 * Colors an HTTP method
 * @param {string} method - HTTP method
 * @returns {string} - Colored method name
 */
const colorMethod = (method: string): string => (methodColors[method] || chalk.white.bold)(method);

const calculateColumnWidths = (routes: { method: string; route: string; file: string }[]): number[] => {
    const terminalWidth = process.stdout.columns || 80;
    let maxMethod = 6, maxRoute = 10, maxFile = 10;

    routes.forEach(({ method, route, file }) => {
        maxMethod = Math.max(maxMethod, method.length);
        maxRoute = Math.max(maxRoute, route.length);
        maxFile = Math.max(maxFile, file.length);
    });

    let totalWidth = maxMethod + maxRoute + maxFile + 10;
    if (totalWidth > terminalWidth) {
        const excess = totalWidth - terminalWidth;
        maxFile = Math.max(10, maxFile - excess);
    } else {
        const extra = terminalWidth - totalWidth;
        maxRoute += Math.floor(extra * 0.6);
        maxFile += Math.floor(extra * 0.4);
    }

    return [maxMethod, maxRoute, maxFile];
};

/**
 * Truncates a string if it exceeds the max length
 * @param {string} str - Input string
 * @param {number} maxLength - Maximum length allowed
 * @returns {string} - Truncated string if necessary
 */
const truncate = (str: string, maxLength: number): string =>
    str.length > maxLength ? str.substring(0, maxLength - 3) + "..." : str;

/**
 * Displays the list of routes in a table
 */
const routeList = async () => {
    const routeFileObjects = await routesList();
    const routeEntries: RouteEntry[] = [];

    routeFileObjects.forEach(({ file, routes }) => {
        Object.keys(routes).forEach((method) => {
            Object.keys(routes[method]).forEach((routePath) => {
                if (routePath === "") {
                    routePath = "/"
                }
                
                routeEntries.push({
                    method,
                    route: routePath,
                    file: path.relative(process.cwd(), file)
                });
            });
        });
    });

    if (routeEntries.length === 0) {
        console.log(chalk.red("❌ No routes found.\n"));
        console.log(chalk.white("If you have routes, check their path or check that dependencies are installed or not."));
        console.log(chalk.white("You can install dependencies with command ") + chalk.cyan("npm install"));
        return;
    }

    const [methodCol, routeCol, fileCol] = calculateColumnWidths(routeEntries);

    // Build the table
    const table = new Table({
        head: [chalk.blue.bold("Method"), chalk.blue.bold("Route"), chalk.blue.bold("Filename")],
        colWidths: [methodCol, routeCol, fileCol].map(width => Math.max(width, 10)),
        wordWrap: true,
        style: { head: [], border: [] }
    });

    // Add routes to the table
    routeEntries.forEach(({ method, route, file }) => {
        table.push([
            colorMethod(method),
            chalk.white(route),
            chalk.yellow(truncate(file, Math.max(fileCol, 10)))
        ]);
    });

    console.log(table.toString());
};
export { routeList };