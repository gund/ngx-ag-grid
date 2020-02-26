import { Logger } from './logger';

export function browserLoggerFactory(): Logger {
  return console;
}
