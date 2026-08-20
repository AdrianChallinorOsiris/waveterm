// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import path from "path";
import { assert, test } from "vitest";
import {
    isFilesystemRoot,
    isPathInside,
    isUsableLaunchCwd,
    resolveFilesCreatePath,
} from "./launchcwd";

test("isFilesystemRoot rejects slash and drive root", () => {
    assert(isFilesystemRoot("/"));
    if (path.parse("C:\\").root === "C:\\") {
        assert(isFilesystemRoot("C:\\"));
    }
    assert(!isFilesystemRoot("/Users/adrian/src/waveterm"));
    assert(!isFilesystemRoot(""));
});

test("isPathInside treats equal and nested paths as inside", () => {
    assert(isPathInside("/app", "/app"));
    assert(isPathInside("/app/bin", "/app"));
    assert(isPathInside("/app/..hidden", "/app"));
    assert(!isPathInside("/Users/work", "/app"));
    assert(!isPathInside("/app-other", "/app"));
});

test("isUsableLaunchCwd keeps a project path", () => {
    assert(isUsableLaunchCwd("/Users/adrian/src/waveterm", true, ["/Applications/Wave.app"]));
});

test("isUsableLaunchCwd rejects empty, non-dirs, roots, and app paths", () => {
    assert(!isUsableLaunchCwd("", true, []));
    assert(!isUsableLaunchCwd("/Users/work", false, []));
    assert(!isUsableLaunchCwd("/", true, []));
    assert(!isUsableLaunchCwd("/Applications/Wave.app/Contents", true, ["/Applications/Wave.app"]));
});

test("resolveFilesCreatePath substitutes tilde and blank when launch cwd is set", () => {
    assert.equal(resolveFilesCreatePath("~", "/work"), "/work");
    assert.equal(resolveFilesCreatePath("", "/work"), "/work");
    assert.equal(resolveFilesCreatePath("/already", "/work"), "/already");
    assert.equal(resolveFilesCreatePath("~", ""), "~");
    assert.equal(resolveFilesCreatePath("", ""), "~");
    assert.equal(resolveFilesCreatePath("~", null), "~");
});
