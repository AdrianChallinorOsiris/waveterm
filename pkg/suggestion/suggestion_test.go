// Copyright 2026, Command Line Inc.
// SPDX-License-Identifier: Apache-2.0

package suggestion

import (
	"context"
	"os"
	"path/filepath"
	"testing"

	"github.com/wavetermdev/waveterm/pkg/wshrpc"
)

func TestFetchFileSuggestionsDirOnly(t *testing.T) {
	dir := t.TempDir()
	if err := os.WriteFile(filepath.Join(dir, "a.txt"), []byte("x"), 0644); err != nil {
		t.Fatalf("write file: %v", err)
	}
	if err := os.Mkdir(filepath.Join(dir, "subdir"), 0755); err != nil {
		t.Fatalf("mkdir: %v", err)
	}

	all, err := FetchSuggestions(context.Background(), wshrpc.FetchSuggestionsData{
		SuggestionType: "file",
		FileCwd:        dir,
		Query:          "",
		WidgetId:       t.Name() + "-all",
	})
	if err != nil {
		t.Fatalf("all: %v", err)
	}
	if !suggestionNamesContain(all.Suggestions, "a.txt") {
		t.Fatalf("expected a.txt in full listing, got %#v", suggestionNames(all.Suggestions))
	}

	dirs, err := FetchSuggestions(context.Background(), wshrpc.FetchSuggestionsData{
		SuggestionType: "file",
		FileCwd:        dir,
		Query:          "",
		WidgetId:       t.Name() + "-dirs",
		FileDirOnly:    true,
	})
	if err != nil {
		t.Fatalf("dirs: %v", err)
	}
	names := suggestionNames(dirs.Suggestions)
	if suggestionNamesContain(dirs.Suggestions, "a.txt") {
		t.Fatalf("dironly included file: %v", names)
	}
	if !suggestionNamesContain(dirs.Suggestions, "subdir") {
		t.Fatalf("dironly missing subdir: %v", names)
	}
}

func suggestionNames(suggestions []wshrpc.SuggestionType) []string {
	var names []string
	for _, s := range suggestions {
		names = append(names, s.FileName)
	}
	return names
}

func suggestionNamesContain(suggestions []wshrpc.SuggestionType, want string) bool {
	for _, s := range suggestions {
		if s.FileName == want || filepath.Base(s.FilePath) == want {
			return true
		}
	}
	return false
}
