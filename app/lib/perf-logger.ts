export interface PerfSpan {
  layer: 'MIDDLEWARE' | 'AUTH' | 'CONTROLLER' | 'SERVICE' | 'REPOSITORY' | 'PRISMA' | 'API';
  name: string;
  durationMs: number;
  details?: Record<string, any>;
  timestamp: string;
}

export function logPerfSpan(span: PerfSpan) {
  const logLine = `[PERF_LOG] [${span.layer}] ${span.name} - ${span.durationMs.toFixed(2)}ms ${span.details ? JSON.stringify(span.details) : ''}`;
  console.log(logLine);
}

export async function measureSpan<T>(
  layer: PerfSpan['layer'],
  name: string,
  fn: () => Promise<T>,
  details?: Record<string, any>
): Promise<T> {
  const start = performance.now();
  try {
    const result = await fn();
    const durationMs = performance.now() - start;
    logPerfSpan({
      layer,
      name,
      durationMs,
      details,
      timestamp: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    const durationMs = performance.now() - start;
    logPerfSpan({
      layer,
      name,
      durationMs,
      details: { ...details, error: (error as Error).message },
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
}
