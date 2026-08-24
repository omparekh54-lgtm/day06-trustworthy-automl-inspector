# Day 06 — Trustworthy AutoML Inspector

A browser-first tabular ML workbench for non-experts that treats **trust diagnostics as part of the model**, not an afterthought.

## Why this is not just another AutoML tool

Most no-code ML products optimize for getting from CSV to a prediction quickly. That can also make invalid ML easy: post-outcome leakage, identifier memorization, inappropriate splits, and tiny improvements over a naive baseline can all look impressive in a dashboard.

Trustworthy AutoML Inspector has a different wedge: **before celebrating a model, try to disqualify it.** The product exposes a naive baseline, leakage/proxy heuristics, a prediction contract, subgroup representation, transparent model form, and explicit warnings when the candidate barely improves on the baseline.

## Core workflow
1. Upload CSV locally in the browser or use the sample dataset.
2. Choose the target and optionally confirm classification/regression.
3. Run the trust inspection.
4. Compare naive baseline vs transparent candidate on an untouched holdout.
5. Review leakage/ID risks and schema contract.
6. Inspect subgroup representation.
7. Export a JSON model card containing the evidence and warnings.

## Current modeling scope
- Classification: majority baseline vs transparent numeric decision stump.
- Regression: mean baseline vs single-feature OLS chosen by absolute training correlation.
- Holdout: deterministic 80/20 row-order split in this first production version.
- **Model selection never uses holdout labels.** Classification feature/direction selection occurs on training rows only; the final candidate is then evaluated on the untouched final 20%.
- Trust checks: target-matching leakage, suspicious outcome-like column names, near-unique identifiers, baseline lift check, data contract, simple slice representation.
- Classification model-card predictions contain the actual predicted class labels, not correctness indicators.

## Confidence & honesty layer
- **Known from data:** row count, schema, missingness, unique counts.
- **Statistical estimate:** holdout accuracy/MAE.
- **Heuristic:** leakage/ID warnings and task auto-detection.
- **Not claimed:** causality, fairness certification, future production performance, or production readiness.

## Input contract
CSV with a header row and at least 12 records. Target must be one column. Numeric-looking cells are parsed as numbers; blanks become missing values.

## Privacy
Uploaded CSV files are read by browser JavaScript. No application database or upload API is used.

## Tests
`npm test` covers CSV parsing, classification task inference, baseline/candidate computation, holdout isolation during classification model selection, classification prediction semantics, near-direct leakage detection, and regression MAE behavior.

Production builds run the test suite automatically through `prebuild`; a failing trust-integrity test blocks deployment.

## Limitations
This Day 06 build intentionally uses small transparent models rather than pretending a browser demo is a full enterprise AutoML platform. The deterministic row-order holdout is useful only when row order is meaningful or at least not adversarial; users should sort chronologically first for time-dependent data. Random/time/group split selection, proper categorical encoding, calibration, confidence abstention, OOD/drift scoring and multi-model cross-validation are the next high-value extensions. The UI calls these limitations out rather than hiding them.
