/**
 * Centralized in-app logger. Every API call and important event flows through
 * here so they can be read in one place — both in the Metro console and in the
 * in-app Debug Logs screen. Keeps a rolling buffer of the most recent entries.
 */
export type LogLevel = 'API' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export interface LogEntry {
  id: number;
  ts: number; // epoch ms
  level: LogLevel;
  tag: string;
  message: string;
  meta?: unknown;
}

const MAX = 300;
let seq = 0;
let entries: LogEntry[] = [];
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/** Record a log entry (buffer + console). */
export function addLog(level: LogLevel, message: string, meta?: unknown, tag = ''): void {
  // In production only keep errors out of the noisy console; still buffer them.
  const entry: LogEntry = { id: ++seq, ts: Date.now(), level, tag, message, meta };
  entries = [entry, ...entries].slice(0, MAX); // newest first
  emit();

  if (!__DEV__ && level !== 'ERROR') return;
  const line = `[${level}]${tag ? ` ${tag}` : ''} — ${message}`;
  // eslint-disable-next-line no-console
  const out = level === 'ERROR' ? console.error : console.log;
  if (meta !== undefined) out(line, meta);
  else out(line);
}

// Keys whose values are masked before an API request/response is stored.
const SENSITIVE = ['password', 'accessToken', 'refreshToken', 'token', 'passwordHash'];

/** Deep-clone with sensitive fields masked, so tokens/passwords never sit in logs. */
function redact(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redact);
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE.includes(k) ? '***' : redact(v);
    }
    return out;
  }
  return value;
}

/**
 * Log an API call + its response with status. The one-line message shows the
 * call and status; `meta` carries the request payload and the response body.
 */
export function logApi(p: {
  method: string;
  endpoint: string;
  status?: number;
  ms?: number;
  ok: boolean;
  request?: unknown;
  response?: unknown;
  error?: unknown;
}): void {
  const status = p.status ? ` → ${p.status}` : ' → (no response)';
  const time = p.ms != null ? ` (${p.ms}ms)` : '';
  const message = `${p.method.toUpperCase()} ${p.endpoint}${status}${time}`;

  const meta: Record<string, unknown> = {};
  if (p.request !== undefined) meta.request = redact(p.request);
  if (p.ok) meta.response = redact(p.response);
  else meta.error = redact(p.error);

  addLog(p.ok ? 'API' : 'ERROR', message, meta, 'API');
}

export function getLogs(): LogEntry[] {
  return entries;
}

export function clearLogs(): void {
  entries = [];
  emit();
}

/** Subscribe to log changes; returns an unsubscribe fn. */
export function subscribeLogs(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}
