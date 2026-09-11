# Workbook reconciliation - 2026-09-11

Read-only source: [#HNAG](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit).
Live metadata contains **35 tabs**, from 00_INDEX through 34_DECISION_RANKING_V1.
The bounded read covered A1:J160 or A1:L160 for each tab, plus A161:L400 for 28_DB_SCHEMA_V1.
There are **1,254 nonempty data rows** (headers excluded; rows can be rules, field definitions or prose).
No source workbook cells were changed.

## Findings and corrections to prepare

The main governance defect is duplicate active and obsolete instructions, not lack of documentation.
There are **45 repeated identifier groups within tabs**. Several pairs contradict each other.
Do not blindly delete every second occurrence: QA-009 includes a useful statistical tolerance
that should be merged into the retained rule. Archive superseded text with its original ID and source row.

| Priority | Evidence | Correction |
|---|---|---|
| P0 | 00_INDEX rows 42/43, IDX-042 | Keep the game-first precedence. Explicitly mark the DB-first alternative superseded. |
| P0 | 01_PRODUCT_VISION rows 24/25, VIS-024 | Define success as accepting a revealed choice. Map/provider clicks are optional downstream actions. |
| P0 | 02_SCOPE_ROADMAP rows 9/10, RM-009 | Keep discovery deferred; remove M1/M2 venue-platform obligations from the active build view. |
| P0 | 08_TECH_STACK rows 30/31, TECH-030; 24_DEVOPS_VERCEL | Keep Vite/React static app and Node 24/pnpm 12.3.4. Rewrite Next.js-specific deployment requirements. |
| P0 | 31_CODE_CONVENTIONS rows 19/20, CODE-019 | Winner freezes in memory before reveal; remove mandatory server persistence. |
| P0 | 25_CLAUDE_CODE_BUILD rows 23/24, CC-023 | Game interaction remains primary; archive the venue/list/map/detail implementation instruction. |
| P1 | 19_DESIGN_SYSTEM and docs/decisions.md | Reconcile the earlier warm/light direction with the recorded dark-theme user decision. Preserve original assets. |
| P1 | 23_PERFORMANCE_QA, QA-006/009/013 | Separate current interaction, distribution and zero-GPS checks from legacy API/location tests; assign unique IDs. |
| P1 | 21_SEO_ANALYTICS, ANA-001..008 vs 27_BUILD_READINESS | Separate a desired measurement taxonomy from an analytics vendor requirement. M1 still has no analytics SDK. |
| P1 | 09/10/11/12/13/15/16/17/28 | Tag the whole deferred architecture surface clearly. An old P0/M1 cell is not approval to activate it. |
| P1 | 18_FRONTEND_COMPONENTS, 32_CLAUDE_MASTER_PROMPT vs current UI | Record current cosmetic themes and the secondary, collapsed pool preview. Do not reintroduce a directory homepage. |
| P2 | 03_PERSONAS_JTBD | Replace unvalidated persona assumptions with interview evidence. Retain original assumptions as hypotheses. |

## Suggested workbook structure

Add explicit **Status**, **Supersedes**, **Source of approval**, **Verification**, and **Last reviewed**
fields to the active rule registry. Use ACTIVE / DEFERRED / SUPERSEDED instead of relying on row order.
Keep one active row per rule ID. Separate current M1 acceptance gates from future phase ideas.
The current correction list is a review artifact, not a live rewrite.

## Coverage inventory

| Tab | Nonempty data rows | Review classification |
|---|---:|---|
| [00_INDEX](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=0) | 50 | Active game contract or supporting reference |
| [01_PRODUCT_VISION](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=101) | 26 | Active game contract or supporting reference |
| [02_SCOPE_ROADMAP](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=102) | 20 | Active game contract or supporting reference |
| [03_PERSONAS_JTBD](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=103) | 10 | Active game contract or supporting reference |
| [04_FEATURES](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=104) | 53 | Active game contract or supporting reference |
| [05_IA_ROUTES](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=105) | 21 | Active game contract or supporting reference |
| [06_USER_FLOWS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=106) | 52 | Active game contract or supporting reference |
| [07_SYSTEM_ARCH](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=107) | 31 | Active game contract or supporting reference |
| [08_TECH_STACK](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=108) | 30 | Active game contract or supporting reference |
| [09_DATA_MODEL](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=109) | 46 | Deferred architecture; legacy phase labels require reconciliation |
| [10_DATA_DICTIONARY](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=110) | 88 | Deferred architecture; legacy phase labels require reconciliation |
| [11_PROVIDER_REGISTRY](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=111) | 17 | Deferred architecture; legacy phase labels require reconciliation |
| [12_INGESTION_PIPELINE](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=112) | 30 | Deferred architecture; legacy phase labels require reconciliation |
| [13_ENTITY_RESOLUTION](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=113) | 30 | Deferred architecture; legacy phase labels require reconciliation |
| [14_DECISION_ENGINE](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=114) | 33 | Active game contract or supporting reference |
| [15_GEO_SEARCH](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=115) | 27 | Deferred architecture; legacy phase labels require reconciliation |
| [16_AUTH_USER_PRIVACY](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=116) | 28 | Deferred architecture; legacy phase labels require reconciliation |
| [17_API_CONTRACTS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=117) | 36 | Deferred architecture; legacy phase labels require reconciliation |
| [18_FRONTEND_COMPONENTS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=118) | 53 | Active game contract or supporting reference |
| [19_DESIGN_SYSTEM](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=119) | 44 | Brand rules; reconcile dark-theme decision |
| [20_BRAND_LOGO](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=120) | 38 | Brand rules; reconcile dark-theme decision |
| [21_SEO_ANALYTICS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=121) | 15 | Mixed legacy/current; rewrite active requirements |
| [22_SECURITY_LEGAL](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=122) | 20 | Active game contract or supporting reference |
| [23_PERFORMANCE_QA](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=123) | 23 | Active game contract or supporting reference |
| [24_DEVOPS_VERCEL](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=124) | 19 | Mixed legacy/current; rewrite active requirements |
| [25_CLAUDE_CODE_BUILD](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=125) | 26 | Active game contract or supporting reference |
| [26_BACKLOG_RISKS_SOURCES](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=126) | 26 | Mixed legacy/current; rewrite active requirements |
| [27_BUILD_READINESS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=1980399180) | 29 | Active game contract or supporting reference |
| [28_DB_SCHEMA_V1](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=632489359) | 160 | Deferred architecture; legacy phase labels require reconciliation |
| [29_REPO_STRUCTURE](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=1953459776) | 55 | Active game contract or supporting reference |
| [30_ENV_EXAMPLE](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=548424147) | 8 | Active game contract or supporting reference |
| [31_CODE_CONVENTIONS](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=1204670508) | 45 | Active game contract or supporting reference |
| [32_CLAUDE_MASTER_PROMPT](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=1155653567) | 2 | Active game contract or supporting reference |
| [33_REPO_REFERENCE_MAP](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=73611059) | 28 | Active game contract or supporting reference |
| [34_DECISION_RANKING_V1](https://docs.google.com/spreadsheets/d/1FIXtdjFG55NIB49HgrAjoSuvUx1S5zsXalnR8bgBk4o/edit#gid=1415689695) | 35 | Active game contract or supporting reference |

## Repeated identifiers requiring reconciliation

Row numbers are 1-based worksheet rows observed during this read.

| Tab | Identifier | Rows |
|---|---|---|
| 00_INDEX | IDX-042 | 42, 43 |
| 01_PRODUCT_VISION | PV-009 | 9, 10 |
| 01_PRODUCT_VISION | PV-012 | 12, 13 |
| 01_PRODUCT_VISION | PV-014 | 14, 15 |
| 01_PRODUCT_VISION | VIS-019 | 19, 20 |
| 01_PRODUCT_VISION | VIS-024 | 24, 25 |
| 02_SCOPE_ROADMAP | RM-009 | 9, 10 |
| 04_FEATURES | FEAT-011 | 11, 12 |
| 04_FEATURES | FEAT-017 | 17, 18 |
| 06_USER_FLOWS | FLOW-026 | 26, 27 |
| 06_USER_FLOWS | FLOW-033 | 33, 34 |
| 06_USER_FLOWS | FLOW-041 | 41, 42 |
| 06_USER_FLOWS | FLOW-048 | 48, 49 |
| 07_SYSTEM_ARCH | ARCH-031 | 31, 32 |
| 08_TECH_STACK | TECH-030 | 30, 31 |
| 14_DECISION_ENGINE | DE-010 | 10, 11 |
| 14_DECISION_ENGINE | DE-023 | 23, 24 |
| 14_DECISION_ENGINE | DE-025 | 25, 26 |
| 14_DECISION_ENGINE | DE-029 | 29, 30 |
| 14_DECISION_ENGINE | DE-033 | 33, 34 |
| 18_FRONTEND_COMPONENTS | UI-008 | 8, 9 |
| 18_FRONTEND_COMPONENTS | UI-014 | 14, 15 |
| 18_FRONTEND_COMPONENTS | UI-017 | 17, 18 |
| 18_FRONTEND_COMPONENTS | UI-019 | 19, 20 |
| 18_FRONTEND_COMPONENTS | FEUI-043 | 43, 44 |
| 19_DESIGN_SYSTEM | DS-010 | 10, 11 |
| 19_DESIGN_SYSTEM | DS-024 | 24, 25 |
| 19_DESIGN_SYSTEM | DS-027 | 27, 28 |
| 19_DESIGN_SYSTEM | DS-041 | 41, 42 |
| 23_PERFORMANCE_QA | QA-006 | 6, 7 |
| 23_PERFORMANCE_QA | QA-009 | 9, 10 |
| 23_PERFORMANCE_QA | QA-013 | 13, 14 |
| 25_CLAUDE_CODE_BUILD | CC-017 | 17, 18 |
| 25_CLAUDE_CODE_BUILD | CC-023 | 23, 24 |
| 27_BUILD_READINESS | BRD-023 | 23, 24 |
| 31_CODE_CONVENTIONS | CODE-008 | 8, 9 |
| 31_CODE_CONVENTIONS | CODE-012 | 12, 13 |
| 31_CODE_CONVENTIONS | CODE-014 | 14, 15 |
| 31_CODE_CONVENTIONS | CODE-017 | 17, 18 |
| 31_CODE_CONVENTIONS | CODE-019 | 19, 20 |
| 31_CODE_CONVENTIONS | CODE-023 | 23, 24 |
| 31_CODE_CONVENTIONS | CODE-030 | 30, 31 |
| 31_CODE_CONVENTIONS | CODE-032 | 32, 33 |
| 31_CODE_CONVENTIONS | CODE-039 | 39, 40 |
| 31_CODE_CONVENTIONS | CODE-044 | 44, 45 |

TASK COMPLETED

