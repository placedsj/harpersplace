const { performance } = require('perf_hooks');

// Simulating window.location.search
const searchString = '?style=Modern%20Studio&width=12&depth=16&color=334155&siding=lap&ramp=true&solar=false&ac=true';

// The function to benchmark (logic from App.tsx/lib/urlUtils.ts)
const parseShedSpecFromSearchString = (search) => {
    const params = new URLSearchParams(search);
    if (!params.has('style')) return null;

    return {
        style: params.get('style') || 'Modern Studio',
        width: parseInt(params.get('width') || '10'),
        depth: parseInt(params.get('depth') || '12'),
        wallColor: params.get('color') ? `#${params.get('color')}` : '#f8fafc',
        sidingType: (params.get('siding')) || 'lap',
        addons: {
            ramp: params.get('ramp') === 'true',
            solar: params.get('solar') === 'true',
            ac: params.get('ac') === 'true',
            loft: params.get('loft') === 'true',
            workbench: params.get('workbench') === 'true',
            shedLoo: params.get('shedLoo') === 'true',
            power_20a: params.get('power_20a') === 'true',
            power_30a: params.get('power_30a') === 'true',
            power_50a: params.get('power_50a') === 'true',
            shedcare: params.get('shedcare') === 'true'
        },
        electricalTier: null,
        // Defaults
        material: 'Metal', terrain: 'grass', time: 50, viewMode: 'exterior',
        renderMode: '3D', inventory: [], landscape: [], pitch: 6, trimColor: '#334155', doorType: 'single'
    };
};

console.log('Starting Benchmark: URL Parameter Parsing');
console.log('-----------------------------------------');

// Verify correctness
const parsed = parseShedSpecFromSearchString(searchString);
console.log('Verification - Parsed Object:', JSON.stringify(parsed, null, 2));
if (parsed.style !== 'Modern Studio' || parsed.width !== 12 || parsed.addons.ac !== true) {
    console.error('ERROR: Parsing logic is incorrect!');
    process.exit(1);
} else {
    console.log('Verification Passed: Logic is correct.');
}

const ITERATIONS = 10000;

// Baseline: Run on every "render"
const startBaseline = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
    parseShedSpecFromSearchString(searchString);
}
const endBaseline = performance.now();
const baselineTime = endBaseline - startBaseline;

console.log(`Baseline (Every Render, ${ITERATIONS} runs): ${baselineTime.toFixed(2)}ms`);
console.log(`Average per render: ${(baselineTime / ITERATIONS).toFixed(4)}ms`);

// Optimized: Run once (memoized)
const startOptimized = performance.now();
// First run (the memoized one)
parseShedSpecFromSearchString(searchString);
// Subsequent runs (accessing the memoized value) - virtually free, but for fairness we can say the cost is just the single run for the lifetime of the component (or dependency change).
// In a real app, accessing the variable `initialSpecFromURL` is instant.
const endOptimized = performance.now();
const optimizedTime = endOptimized - startOptimized;

console.log(`Optimized (Once via useMemo): ${optimizedTime.toFixed(2)}ms`);

const improvement = baselineTime / optimizedTime;
console.log('-----------------------------------------');
console.log(`Speedup Factor (Total CPU time saved over ${ITERATIONS} renders): ${improvement.toFixed(2)}x`);
