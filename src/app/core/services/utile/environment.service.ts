import {InjectionToken} from '@angular/core';
import {environment} from '@environments/environment';
import { Environment } from '@models/environment';

export const ENVIRONMENT = new InjectionToken<{ [key: string]: any }>('environment');

export function getEnvironment(): Environment {
  return environment;
}
