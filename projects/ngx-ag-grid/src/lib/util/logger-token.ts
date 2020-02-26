import { InjectionToken } from '@angular/core';

import { Logger } from './logger';
import { browserLoggerFactory } from './logger-browser';

export const LOGGER_TOKEN = new InjectionToken<Logger>('Logger', {
  providedIn: 'root',
  factory: browserLoggerFactory,
});
