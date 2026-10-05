/**
 * Centralized dev-console logger. Every API call and important event flows
 * through here so they're readable in one place in the Metro console.
 * Non-error logs never print outside __DEV__, so none of this ever reaches
 * a real user — there's no in-app log viewer.
 */
export type LogLevel = 'API' | 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

/** Print a log line to the console (errors always; everything else dev-only). */
export function addLog(level: LogLevel, message: string, meta?: unknown, tag = ''): void {
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
