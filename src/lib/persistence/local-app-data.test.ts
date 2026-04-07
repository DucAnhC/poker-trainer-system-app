import { describe, expect, it } from "vitest";

import {
  localAppDataSchema,
  localAppDataVersion,
  parseLocalAppDataImport,
} from "@/lib/persistence/local-app-data";

describe("parseLocalAppDataImport", () => {
  it("rejects empty input", () => {
    const result = parseLocalAppDataImport("   ");

    expect(result).toEqual({
      ok: false,
      message: "Import data was empty. Choose a saved JSON export first.",
    });
  });

  it("rejects JSON that does not look like an app backup", () => {
    const result = parseLocalAppDataImport(JSON.stringify({ foo: "bar" }));

    expect(result.ok).toBe(false);
    expect(result.message).toContain("expected local backup shape");
  });

  it("normalizes a recognizable backup payload", () => {
    const result = parseLocalAppDataImport(
      JSON.stringify({
        version: 0,
        exportedAt: "not-a-date",
        progress: {
          attempts: [],
          sessions: [],
          updatedAt: null,
        },
        handReviewNotes: [],
      }),
    );

    expect(result.ok).toBe(true);

    if (!result.ok) {
      return;
    }

    expect(result.data.schema).toBe(localAppDataSchema);
    expect(result.data.version).toBe(localAppDataVersion);
    expect(result.data.exportedAt).toMatch(/^20\d\d-/);
    expect(result.data.progress).toEqual({
      attempts: [],
      sessions: [],
      updatedAt: null,
    });
    expect(result.data.handReviewNotes).toEqual([]);
    expect(result.message).toContain("replaced on import");
  });
});
