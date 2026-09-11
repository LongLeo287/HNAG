import { readFileSync, readdirSync } from "node:fs";

// CODE-003/RS-019: import-direction gate. randomizer/domain must stay pure —
// no React/DOM/audio/storage — so winner logic is testable independently of presentation.
interface Rule {
  dir: string;
  forbidden: RegExp[];
  description: string;
}

const RULES: Rule[] = [
  {
    dir: "src/features/randomizer/domain",
    forbidden: [
      /from ["']react/,
      /from ["']react-dom/,
      /from ["']@\/features\/audio/,
      /from ["']@\/features\/reveal/,
      /from ["']@\/lib\/local-preferences/,
      /\bdocument\./,
      /\bwindow\./,
      /localStorage/,
    ],
    description: "randomizer/domain must stay pure TypeScript (no React/DOM/audio/storage)",
  },
  {
    dir: "src/features/reveal/themes/case-reel",
    forbidden: [/from ["']@\/features\/randomizer\/domain\/(eligibility|draw|weighting|rng)["']/],
    description: "reveal themes may only depend on randomizer *types*/results, never re-implement selection",
  },
];

function listFiles(dir: string): string[] {
  try {
    return readdirSync(dir, { recursive: true, encoding: "utf-8" } as never)
      .map((entry) => `${dir}/${entry}`)
      .filter((path) => /\.(ts|tsx)$/.test(path) && !path.includes(".test."));
  } catch {
    return [];
  }
}

let violations = 0;

for (const rule of RULES) {
  for (const filePath of listFiles(rule.dir)) {
    let contents: string;
    try {
      contents = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }
    for (const pattern of rule.forbidden) {
      if (pattern.test(contents)) {
        console.error(`✖ check:boundaries — ${filePath} violates: ${rule.description} (matched ${pattern})`);
        violations += 1;
      }
    }
  }
}

if (violations > 0) {
  console.error(`✖ check:boundaries — ${violations} violation(s)`);
  process.exit(1);
}
console.log("✓ check:boundaries — no forbidden imports found");
