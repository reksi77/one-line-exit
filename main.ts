// The One-Line Exit — make.fun bounty u-kreutzx-the-one-line-exit-1dc652d1
//
// Writes one funny, single-line resignation letter to /output/entry.txt.
// Deterministic: no randomness, no clock, no environment input — the same
// bytes come out on every run.
//
// The line: a subway announcer quits with his own catchphrase.
// "I resign: after six years of saying 'stand clear of the closing doors,'
//  I have decided to stand clear of this job."
// 114 characters, one line, plain ASCII.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const LINE =
  "I resign: after six years of saying 'stand clear of the closing doors,' I have decided to stand clear of this job.";

const OUT_PATH = process.env.OUTPUT_PATH ?? "/output/entry.txt";

function main(): void {
  // Gate: the entry must be 1-140 characters, exactly one line, not only
  // whitespace, valid UTF-8. Count code points, not bytes.
  const length = [...LINE].length;
  if (length < 1 || length > 140) {
    throw new Error(`entry is ${length} characters, must be 1-140`);
  }
  if (LINE.includes("\n") || LINE.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  if (/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(LINE)) {
    throw new Error("entry contains control characters");
  }
  if (LINE.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }

  mkdirSync(dirname(OUT_PATH), { recursive: true });
  // No trailing newline: the file holds exactly the one line, so its
  // character count is the line's character count.
  writeFileSync(OUT_PATH, LINE, "utf8");

  // Read back and verify: what is on disk must be byte-for-byte the line
  // the gate checked above, so a silent write failure can never pass.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== LINE) {
    throw new Error("read-back mismatch: entry on disk differs from the line");
  }
  if ([...written].length !== length) {
    throw new Error("read-back mismatch: entry length changed on disk");
  }
}

main();
