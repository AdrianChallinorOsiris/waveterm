// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

import { assert, test } from "vitest";
import { applyDirectorySelection, nativeDragPaths, shouldNativeFileDrag } from "./preview-directory-utils";

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

test("shouldNativeFileDrag allows local directories and rejects remote or parent entries", () => {
    assert(shouldNativeFileDrag("", fileInfo({ isdir: true, path: "/tmp/docs", name: "docs" })));
    assert(!shouldNativeFileDrag("ssh://host", fileInfo()));
    assert(!shouldNativeFileDrag("wsl://Ubuntu", fileInfo()));
    assert(!shouldNativeFileDrag("", fileInfo({ name: "..", path: "/tmp", isdir: true })));
    assert(!shouldNativeFileDrag("", fileInfo({ path: "" })));
    assert(!shouldNativeFileDrag("", null));
});

test("nativeDragPaths drags one entry, or every selected local entry", () => {
    const notes = fileInfo({ path: "/tmp/notes.md", name: "notes.md" });
    const plan = fileInfo({ path: "/tmp/plan.md", name: "plan.md" });
    const docs = fileInfo({ path: "/tmp/docs", name: "docs", isdir: true });
    const parent = fileInfo({ path: "/tmp", name: "..", isdir: true });

    assert.deepEqual(nativeDragPaths("", notes, []), ["/tmp/notes.md"]);
    assert.deepEqual(nativeDragPaths("", notes, [plan]), ["/tmp/notes.md"]);
    assert.deepEqual(nativeDragPaths("", notes, [notes, plan, docs, parent]), ["/tmp/notes.md", "/tmp/plan.md", "/tmp/docs"]);
    assert.deepEqual(nativeDragPaths("ssh://host", notes, [notes, plan]), []);
});

test("applyDirectorySelection replaces, toggles, and ranges", () => {
    const entries = [{ path: "/a" }, { path: "/b" }, { path: "/c" }];

    const replaced = applyDirectorySelection(entries, ["/c"], "/c", 0, "replace");
    assert.deepEqual(replaced, { selectedPaths: ["/a"], anchorPath: "/a" });

    const toggled = applyDirectorySelection(entries, ["/a"], "/a", 2, "toggle");
    assert.deepEqual(toggled, { selectedPaths: ["/a", "/c"], anchorPath: "/c" });

    const ranged = applyDirectorySelection(entries, ["/a"], "/a", 2, "range");
    assert.deepEqual(ranged, { selectedPaths: ["/a", "/b", "/c"], anchorPath: "/a" });
});
