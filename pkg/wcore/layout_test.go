// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

package wcore

import (
	"os"
	"path/filepath"
	"testing"
)

func TestFilesPathForCreate_Empty(t *testing.T) {
	if got := FilesPathForCreate(""); got != "~" {
		t.Fatalf("empty: got %q want ~", got)
	}
	if got := FilesPathForCreate("   "); got != "~" {
		t.Fatalf("blank: got %q want ~", got)
	}
}

func TestFilesPathForCreate_Missing(t *testing.T) {
	if got := FilesPathForCreate(filepath.Join(t.TempDir(), "no-such-dir")); got != "~" {
		t.Fatalf("missing: got %q want ~", got)
	}
}

func TestFilesPathForCreate_FileNotDir(t *testing.T) {
	dir := t.TempDir()
	file := filepath.Join(dir, "a.txt")
	if err := os.WriteFile(file, []byte("x"), 0644); err != nil {
		t.Fatalf("write: %v", err)
	}
	if got := FilesPathForCreate(file); got != "~" {
		t.Fatalf("file: got %q want ~", got)
	}
}

func TestFilesPathForCreate_Dir(t *testing.T) {
	dir := t.TempDir()
	if got := FilesPathForCreate(dir); got != dir {
		t.Fatalf("dir: got %q want %q", got, dir)
	}
}
