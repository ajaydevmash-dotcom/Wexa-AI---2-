#!/usr/bin/env bash
# CognoDB Cloud Benchmark One-Command Runner

set -e

echo "=========================================================="
echo "    CognoDB Cloud Graph Database Benchmark Suite"
echo "=========================================================="

echo "[1/3] Generating Standardized 120k SNAP Dataset..."
npx tsx benchmark/dataset-generator.ts

echo "[2/3] Executing Benchmark Harness..."
npx tsx benchmark/runner.ts

echo "[3/3] Benchmark Suite Finished Successfully!"
echo "View full matrix in README.md, BENCHMARK_REPORT.md or run 'npm run dev' for interactive web UI."
