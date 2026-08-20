// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { isBlank } from "@/util/util";

export function isParentDirEntry(finfo: FileInfo): boolean {
    return finfo?.name === "..";
}

export function sourceBasename(path: string): string {
    if (isBlank(path)) {
        return "";
    }
    const trimmed = path.replace(/\/+$/, "");
    const parts = trimmed.split("/");
    return parts[parts.length - 1] ?? "";
}

export function joinMoveDest(destDir: string, basename: string): string {
    const trimmed = (destDir ?? "").replace(/\/+$/, "");
    return `${trimmed}/${basename}`;
}

export function resolveTypedDestPath(query: string, currentDir: string): string {
    if (isBlank(query)) {
        return "";
    }
    if (query.startsWith("/") || query.startsWith("~")) {
        return query;
    }
    const trimmedDir = (currentDir ?? "").replace(/\/+$/, "");
    return `${trimmedDir}/${query}`;
}

export function isAlreadyExistsMoveError(errorText: string): boolean {
    return (errorText ?? "").includes("already exists");
}

export function isSameMovePath(src: string, dest: string): boolean {
    const normalize = (p: string) => (p ?? "").replace(/\/+$/, "");
    const a = normalize(src);
    const b = normalize(dest);
    if (isBlank(a) || isBlank(b)) {
        return false;
    }
    return a === b;
}
