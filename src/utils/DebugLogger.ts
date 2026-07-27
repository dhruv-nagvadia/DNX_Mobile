/**
 * Dev-only structured logger. In production, wire the ERROR branch to
 * Crashlytics/Sentry. Signature mirrors the Healppy convention:
 *   DEBUG_LOGGER(message, functionName, file, line, level)
 */
export const INFO = 'INFO';
export const SUCCESS = 'SUCCESS';
export const WARNING = 'WARNING';
export const ERROR = 'ERROR';

type Level = typeof INFO | typeof SUCCESS | typeof WARNING | typeof ERROR;

export default function DEBUG_LOGGER(
  message: string,
  fn = '',
  file = '',
  line = '',
  level: Level = INFO,
) {
  if (!__DEV__ && level !== ERROR) return;
  const tag = `[${level}] ${file}${fn ? `::${fn}` : ''}${line ? `:${line}` : ''}`;
  // eslint-disable-next-line no-console
  const out = level === ERROR ? console.error : console.log;
  out(`${tag} — ${message}`);
}
