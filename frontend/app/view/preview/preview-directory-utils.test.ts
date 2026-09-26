// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { assert, test } from "vitest";
import { shouldNativeFileDrag } from "./preview-directory-utils";

function fileInfo(overrides: Partial<FileInfo> = {}): FileInfo {
    return {
        path: "/tmp/notes.txt",
        name: "notes.txt",
        isdir: false,
        ...overrides,
    } as FileInfo;
}

test("shouldNativeFileDrag allows local files", () => {
    assert(shouldNativeFileDrag("", fileInfo()));
    assert(shouldNativeFileDrag("local", fileInfo()));
    assert(shouldNativeFileDrag("local:mac", fileInfo()));
});

test("shouldNativeFileDrag rejects remote, dirs, and parent entries", () => {
    assert(!shouldNativeFileDrag("ssh://host", fileInfo()));
    assert(!shouldNativeFileDrag("wsl://Ubuntu", fileInfo()));
    assert(!shouldNativeFileDrag("", fileInfo({ isdir: true, path: "/tmp", name: "tmp" })));
    assert(!shouldNativeFileDrag("", fileInfo({ name: "..", path: "/tmp" })));
    assert(!shouldNativeFileDrag("", fileInfo({ path: "" })));
    assert(!shouldNativeFileDrag("", null));
});
