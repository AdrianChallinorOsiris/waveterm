// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import path from "path";
import { isBlank } from "./util";

export function isFilesystemRoot(cwd: string): boolean {
    if (isBlank(cwd)) {
        return false;
    }
    const parsed = path.parse(cwd);
    return parsed.root === cwd;
}

export function isPathInside(child: string, parent: string): boolean {
    if (isBlank(child) || isBlank(parent)) {
        return false;
    }
    const rel = path.relative(path.resolve(parent), path.resolve(child));
    return rel === "" || (!rel.startsWith("..") && !path.isAbsolute(rel));
}

export function isUsableLaunchCwd(cwd: string, isDirectory: boolean, appPaths: string[]): boolean {
    if (isBlank(cwd) || !isDirectory) {
        return false;
    }
    if (isFilesystemRoot(cwd)) {
        return false;
    }
    for (const appPath of appPaths ?? []) {
        if (!isBlank(appPath) && isPathInside(cwd, appPath)) {
            return false;
        }
    }
    return true;
}

export function resolveFilesCreatePath(configuredFile: string, launchCwd: string): string {
    const file = configuredFile ?? "";
    const cwd = launchCwd ?? "";
    if (isBlank(cwd)) {
        return isBlank(file) ? "~" : file;
    }
    if (isBlank(file) || file === "~") {
        return cwd;
    }
    return file;
}
