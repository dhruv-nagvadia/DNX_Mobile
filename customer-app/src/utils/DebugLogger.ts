/**
 * Structured logger. Routes through the centralized logger so every entry is
 * both printed to the console and captured in the in-app Debug Logs screen.
 *   DEBUG_LOGGER(message, functionName, file, line, level)
 */
import { addLog } from './logger';

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
  const tag = `${file}${fn ? `::${fn}` : ''}${line ? `:${line}` : ''}`;
  addLog(level, message, undefined, tag);
}
