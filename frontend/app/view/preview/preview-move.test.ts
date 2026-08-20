// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { assert, test } from "vitest";
import {
    isAlreadyExistsMoveError,
    isParentDirEntry,
    joinMoveDest,
    resolveTypedDestPath,
    sourceBasename,
} from "./preview-move";

test("isParentDirEntry only matches ..", () => {
    assert(isParentDirEntry({ name: "..", path: "/tmp" } as FileInfo));
    assert(!isParentDirEntry({ name: "foo", path: "/tmp/foo" } as FileInfo));
    assert(!isParentDirEntry(null));
});

test("sourceBasename uses the last path segment", () => {
    assert.equal(sourceBasename("/tmp/foo.txt"), "foo.txt");
    assert.equal(sourceBasename("/tmp/dir/"), "dir");
    assert.equal(sourceBasename("foo"), "foo");
});

test("joinMoveDest strips trailing slashes on the destination dir", () => {
    assert.equal(joinMoveDest("/tmp", "foo.txt"), "/tmp/foo.txt");
    assert.equal(joinMoveDest("/tmp/", "foo.txt"), "/tmp/foo.txt");
});

test("resolveTypedDestPath keeps abs and tilde, joins relatives", () => {
    assert.equal(resolveTypedDestPath("/var/tmp", "/home"), "/var/tmp");
    assert.equal(resolveTypedDestPath("~/docs", "/home"), "~/docs");
    assert.equal(resolveTypedDestPath("sub", "/home/work"), "/home/work/sub");
});

test("isAlreadyExistsMoveError matches remote move wording", () => {
    assert(isAlreadyExistsMoveError(`destination "/tmp/foo" already exists`));
    assert(!isAlreadyExistsMoveError("permission denied"));
});
