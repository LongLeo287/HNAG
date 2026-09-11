import { existsSync, readFileSync, readdirSync } from "node:fs";

// CODE-006/010/024/032 + BRD-001..030: M0/M1 must never grow DB/auth/Maps/provider/commerce
// surfaces by accident. This is a deliberately blunt scope tripwire, not a full static analyzer.

const FORBIDDEN_DEPENDENCIES = [
  "next",
  "drizzle-orm",
  "prisma",
  "@prisma/client",
  "pg",
  "postgres",
  "@supabase/supabase-js",
  "@supabase/ssr",
  "@googlemaps/js-api-loader",
  "ioredis",
  "redis",
];

const FORBIDDEN_PATHS = [
  "src/db",
  "src/app/api",
  "src/features/providers",
  "src/features/discovery",
  "src/features/maps",
  "src/features/location",
  "src/features/auth",
];

// CODE-024: permanent non-commerce invariant. Matched as whole words to avoid flagging
// incidental substrings (e.g. "background" containing "ground").
const FORBIDDEN_SOURCE_PATTERNS: RegExp[] = [
  /\bshopping ?cart\b/i,
  /\bcheckout\b/i,
  /\bpayment\b/i,
  /\bwallet\b/i,
  /\border[_-]?confirmation\b/i,
  /\bdelivery[_-]?tracking\b/i,
];

let violations = 0;

function checkDependencies(): void {
  const pkg = JSON.parse(readFileSync("package.json", "utf-8")) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const all = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const name of FORBIDDEN_DEPENDENCIES) {
    if (all[name]) {
      console.error(`✖ check:scope — forbidden M0/M1 dependency present: ${name}`);
      violations += 1;
    }
  }
}

function checkPaths(): void {
  for (const path of FORBIDDEN_PATHS) {
    if (existsSync(path)) {
      console.error(`✖ check:scope — forbidden M0/M1 path exists: ${path}`);
      violations += 1;
    }
  }
}

function listSourceFiles(dir: string): string[] {
  try {
    return readdirSync(dir, { recursive: true, encoding: "utf-8" } as never)
      .map((entry) => `${dir}/${entry}`)
      .filter((path) => /\.(ts|tsx|css)$/.test(path));
  } catch {
    return [];
  }
}

function checkSourcePatterns(): void {
  for (const filePath of listSourceFiles("src")) {
    let contents: string;
    try {
      contents = readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }
    for (const pattern of FORBIDDEN_SOURCE_PATTERNS) {
      if (pattern.test(contents)) {
        console.error(`✖ check:scope — ${filePath} matches forbidden non-commerce pattern: ${pattern}`);
        violations += 1;
      }
    }
  }
}

checkDependencies();
checkPaths();
checkSourcePatterns();

if (violations > 0) {
  console.error(`✖ check:scope — ${violations} violation(s)`);
  process.exit(1);
}
console.log("✓ check:scope — no M2+/commerce scope drift detected");
