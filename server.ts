import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import neo4j from 'neo4j-driver';
import { BENCHMARK_RESULTS, DATABASE_SPECS, BENCHMARK_DATASET_INFO } from './src/data/benchmark-data.js';
import { BenchmarkRunner } from './benchmark/runner.js';
import { generateBenchmarkGraph } from './benchmark/dataset-generator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    envTarget: process.env.COGNODB_URI || 'bolt+s://db-5ab0a156.bravo.databases.cognodb.com'
  });
});

// 2. Fetch all database comparison results & specs
app.get('/api/benchmark/results', (req, res) => {
  res.json({
    datasetInfo: BENCHMARK_DATASET_INFO,
    specs: DATABASE_SPECS,
    results: BENCHMARK_RESULTS
  });
});

// 3. Test Live Connection to CognoDB / Bolt server
app.post('/api/benchmark/test-connection', async (req, res) => {
  const { uri, username, password } = req.body;
  const targetUri = uri || process.env.COGNODB_URI || 'bolt+s://db-5ab0a156.bravo.databases.cognodb.com';
  const targetUser = username || process.env.COGNODB_USER || 'cognodb';
  const targetPassword = password || process.env.COGNODB_PASSWORD || '';

  if (!targetPassword) {
    return res.status(400).json({
      success: false,
      message: 'Password is required to connect to CognoDB Cloud instance.'
    });
  }

  let driver;
  try {
    driver = neo4j.driver(targetUri, neo4j.auth.basic(targetUser, targetPassword), {
      connectionTimeout: 8000
    });
    await driver.verifyConnectivity();

    const session = driver.session();
    let nodeCount = 0;
    let relCount = 0;

    try {
      const nodeRes = await session.run('MATCH (n) RETURN count(n) AS c');
      if (nodeRes.records.length > 0) {
        nodeCount = nodeRes.records[0].get('c').toNumber?.() ?? Number(nodeRes.records[0].get('c'));
      }
      const relRes = await session.run('MATCH ()-[r]->() RETURN count(r) AS c');
      if (relRes.records.length > 0) {
        relCount = relRes.records[0].get('c').toNumber?.() ?? Number(relRes.records[0].get('c'));
      }
    } catch {
      // ignore query errors if empty
    } finally {
      await session.close();
    }

    res.json({
      success: true,
      uri: targetUri,
      user: targetUser,
      nodeCount,
      relCount,
      message: 'Successfully connected to CognoDB instance via Neo4j Bolt protocol.'
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      success: false,
      message: `Failed to connect to ${targetUri}: ${errorMsg}`
    });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
});

// 4. Execute Custom Cypher Query Live
app.post('/api/benchmark/cypher', async (req, res) => {
  const { uri, username, password, query, params } = req.body;
  const targetUri = uri || process.env.COGNODB_URI || 'bolt+s://db-5ab0a156.bravo.databases.cognodb.com';
  const targetUser = username || process.env.COGNODB_USER || 'cognodb';
  const targetPassword = password || process.env.COGNODB_PASSWORD || '';

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query string is required' });
  }

  if (!targetPassword) {
    return res.status(400).json({ success: false, message: 'Password is required' });
  }

  let driver;
  const startTime = performance.now();

  try {
    driver = neo4j.driver(targetUri, neo4j.auth.basic(targetUser, targetPassword));
    const session = driver.session();

    const result = await session.run(query, params || {});
    const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

    const records = result.records.map((r) => {
      const obj: Record<string, unknown> = {};
      r.keys.forEach((k) => {
        const val = r.get(k);
        obj[String(k)] = val && typeof val === 'object' && 'toNumber' in val ? (val as { toNumber: () => number }).toNumber() : val;
      });
      return obj;
    });

    await session.close();

    res.json({
      success: true,
      executionTimeMs,
      rowCount: records.length,
      records: records.slice(0, 100) // limit for payload safety
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({
      success: false,
      executionTimeMs: parseFloat((performance.now() - startTime).toFixed(2)),
      message: errorMsg
    });
  } finally {
    if (driver) {
      await driver.close();
    }
  }
});

// 5. Seed synthetic dataset into CognoDB instance
app.post('/api/benchmark/seed', async (req, res) => {
  const { uri, username, password, size } = req.body;
  const targetUri = uri || process.env.COGNODB_URI || 'bolt+s://db-5ab0a156.bravo.databases.cognodb.com';
  const targetUser = username || process.env.COGNODB_USER || 'cognodb';
  const targetPassword = password || process.env.COGNODB_PASSWORD || '';

  if (!targetPassword) {
    return res.status(400).json({ success: false, message: 'Password is required to seed database' });
  }

  try {
    const numUsers = size === 'small' ? 5000 : 20000;
    const numPapers = size === 'small' ? 1000 : 5000;
    const numEdges = size === 'small' ? 25000 : 100000;

    const dataset = generateBenchmarkGraph(numUsers, numPapers, numEdges, 15000);

    const runner = new BenchmarkRunner({
      uri: targetUri,
      user: targetUser,
      password: targetPassword,
      iterations: 20,
      warmup: 5,
      concurrencies: [1, 10],
      batchSize: 1000
    });

    const connected = await runner.connect();
    if (!connected) {
      return res.status(500).json({ success: false, message: 'Could not connect to database' });
    }

    await runner.createSchemaAndIndexes();
    const stats = await runner.loadDataset(dataset);
    await runner.close();

    res.json({
      success: true,
      stats,
      datasetMetadata: dataset.metadata
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, message: errorMsg });
  }
});

// 6. Live Benchmark Execution on Demand
app.post('/api/benchmark/run-live', async (req, res) => {
  const { uri, username, password, iterations = 50 } = req.body;
  const targetUri = uri || process.env.COGNODB_URI || 'bolt+s://db-5ab0a156.bravo.databases.cognodb.com';
  const targetUser = username || process.env.COGNODB_USER || 'cognodb';
  const targetPassword = password || process.env.COGNODB_PASSWORD || '';

  if (!targetPassword) {
    return res.status(400).json({ success: false, message: 'Password is required for live benchmark' });
  }

  try {
    const runner = new BenchmarkRunner({
      uri: targetUri,
      user: targetUser,
      password: targetPassword,
      iterations: Math.min(iterations, 100),
      warmup: 10,
      concurrencies: [1, 10, 40],
      batchSize: 1000
    });

    const connected = await runner.connect();
    if (!connected) {
      return res.status(500).json({ success: false, message: 'Connection failed' });
    }

    const traversals = await runner.runTraversals();
    const lookups = await runner.runLookups();
    const aggregations = await runner.runAggregations();
    await runner.close();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      traversals,
      lookups,
      aggregations
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    res.status(500).json({ success: false, message: errorMsg });
  }
});

// Start server with Vite middleware support
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CognoDB Cloud Benchmark Suite server running on http://localhost:${PORT}`);
  });
}

start();
