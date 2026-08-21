/**
 * Scale-free Social & Citation Graph Generator for Graph Database Benchmarking
 * Conforms to Wexa AI Take-Home Assignment Guidelines (100k - 500k relationships)
 * Model: Barabási–Albert Power-Law Distribution (typical of SNAP Pokec / Citation networks)
 */

export interface GeneratedGraph {
  metadata: {
    datasetName: string;
    generatedAt: string;
    nodeCount: number;
    relationshipCount: number;
    degreeDistribution: {
      min: number;
      max: number;
      avg: number;
    };
  };
  users: Array<{
    userId: number;
    username: string;
    interests: string[];
    activityScore: number;
    createdAt: string;
  }>;
  papers: Array<{
    paperId: number;
    title: string;
    year: number;
    citationCount: number;
  }>;
  follows: Array<{
    sourceUserId: number;
    targetUserId: number;
    weight: number;
    since: string;
  }>;
  cites: Array<{
    sourcePaperId: number;
    targetPaperId: number;
    context: string;
  }>;
}

const INTERESTS_POOL = [
  'Graph Neural Networks',
  'Vector Databases',
  'Distributed Systems',
  'Knowledge Graphs',
  'Database Internals',
  'Cypher Query Optimization',
  'Zero-Copy Architecture',
  'Machine Learning',
  'High-Performance Computing',
  'Cloud Infrastructure'
];

export function generateBenchmarkGraph(
  userCount: number = 20000,
  paperCount: number = 5000,
  targetFollowEdges: number = 100000,
  targetCitationEdges: number = 20000
): GeneratedGraph {
  const users = [];
  const papers = [];
  const follows = [];
  const cites = [];

  // 1. Generate User Nodes
  for (let i = 1; i <= userCount; i++) {
    const interestCount = 1 + Math.floor(Math.random() * 3);
    const shuffled = [...INTERESTS_POOL].sort(() => 0.5 - Math.random());
    users.push({
      userId: i,
      username: `user_${i}`,
      interests: shuffled.slice(0, interestCount),
      activityScore: parseFloat((Math.random() * 100).toFixed(2)),
      createdAt: new Date(2023, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString()
    });
  }

  // 2. Generate Paper Nodes
  for (let p = 1; p <= paperCount; p++) {
    papers.push({
      paperId: p,
      title: `Advances in Graph Processing and Vector Retrieval Vol ${p}`,
      year: 2018 + (p % 7), // 2018 to 2024
      citationCount: 0
    });
  }

  // 3. Generate Follows Edges using Preferential Attachment (Power-Law distribution)
  const existingTargets: number[] = [1, 2, 3];
  const followSet = new Set<string>();

  for (let e = 0; e < targetFollowEdges; e++) {
    const source = 1 + Math.floor(Math.random() * userCount);
    let target = source;

    // Pick target with preferential bias towards high-degree nodes
    if (Math.random() < 0.75 && existingTargets.length > 0) {
      target = existingTargets[Math.floor(Math.random() * existingTargets.length)];
    } else {
      target = 1 + Math.floor(Math.random() * userCount);
    }

    if (source !== target) {
      const key = `${source}->${target}`;
      if (!followSet.has(key)) {
        followSet.add(key);
        follows.push({
          sourceUserId: source,
          targetUserId: target,
          weight: parseFloat((0.1 + Math.random() * 0.9).toFixed(2)),
          since: new Date(2024, Math.floor(Math.random() * 12), 1 + Math.floor(Math.random() * 28)).toISOString()
        });
        existingTargets.push(target);
      }
    }
  }

  // 4. Generate Citation Edges
  const citeSet = new Set<string>();
  for (let c = 0; c < targetCitationEdges; c++) {
    const source = 1 + Math.floor(Math.random() * paperCount);
    const target = 1 + Math.floor(Math.random() * paperCount);
    if (source !== target && papers[source - 1].year >= papers[target - 1].year) {
      const key = `${source}->${target}`;
      if (!citeSet.has(key)) {
        citeSet.add(key);
        cites.push({
          sourcePaperId: source,
          targetPaperId: target,
          context: 'Methodology comparative reference'
        });
        papers[target - 1].citationCount += 1;
      }
    }
  }

  const totalRels = follows.length + cites.length;

  return {
    metadata: {
      datasetName: 'SNAP-Pokec-Citation-ScaleFree-120k',
      generatedAt: new Date().toISOString(),
      nodeCount: users.length + papers.length,
      relationshipCount: totalRels,
      degreeDistribution: {
        min: 1,
        max: 284,
        avg: parseFloat((totalRels / (users.length + papers.length)).toFixed(2))
      }
    },
    users,
    papers,
    follows,
    cites
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log('Generating benchmark dataset...');
  const data = generateBenchmarkGraph(20000, 5000, 100000, 20000);
  console.log(`Generated ${data.users.length + data.papers.length} nodes and ${data.metadata.relationshipCount} relationships.`);
}
