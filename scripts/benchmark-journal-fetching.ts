import { performance } from 'perf_hooks';

// Simulate a Journal Entry structure based on codebase
interface JournalEntry {
  id: string;
  title: string;
  date: Date;
  content: string;
  image?: string;
  dataAiHint?: string;
  userId: string;
  timestamp: any;
}

const generateEntries = (count: number): JournalEntry[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `entry-${i}`,
    title: `Journal Entry ${i}`,
    date: new Date(),
    content: `This is the content for journal entry ${i}. It is a simulated memory with enough text to consume some memory allocation space.`,
    image: `https://picsum.photos/seed/${i}/400/200`,
    dataAiHint: 'memory placeholder',
    userId: 'user-123',
    timestamp: new Date(),
  }));
};

const runBenchmark = async () => {
  console.log('--- Journal Data Processing Benchmark ---');

  // Force GC if possible (requires --expose-gc flag, usually not available by default in node, skipping)

  // Baseline: Fetch ALL (simulated 5000 entries to exaggerate effect)
  const baselineCount = 5000;
  console.log(`\nSimulating FETCH ALL (${baselineCount} entries)...`);

  const startAll = performance.now();
  const allEntries = generateEntries(baselineCount);
  // Simulate processing overhead (e.g. mapping, sorting, React rendering preparation)
  // We simulate a heavy operation like serialization or deep clone
  const processedAll = JSON.parse(JSON.stringify(allEntries));
  const endAll = performance.now();

  console.log(`Processing Time (Baseline): ${(endAll - startAll).toFixed(2)} ms`);
  const memoryAll = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log(`Approx. Heap Usage: ${memoryAll.toFixed(2)} MB`);

  // Optimization: Fetch LIMIT (simulated 10 entries)
  const optimizedCount = 10;
  console.log(`\nSimulating FETCH LIMIT (${optimizedCount} entries)...`);

  const startLimit = performance.now();
  const limitedEntries = generateEntries(optimizedCount);
  // Same simulated processing overhead
  const processedLimit = JSON.parse(JSON.stringify(limitedEntries));
  const endLimit = performance.now();

  console.log(`Processing Time (Optimized): ${(endLimit - startLimit).toFixed(2)} ms`);
  const memoryLimit = process.memoryUsage().heapUsed / 1024 / 1024; // Note: this accumulates, so diff is hard to see in one run without GC
  console.log(`Approx. Heap Usage: ${memoryLimit.toFixed(2)} MB`);

  const improvement = ((endAll - startAll) / (endLimit - startLimit));
  console.log(`\nPerformance Factor: Optimized is approx ${improvement.toFixed(1)}x faster in processing.`);
};

runBenchmark();
