import {InjectionToken, Injectable, Inject, Optional} from '@angular/core';
import {environment} from '@environments/environment';
import { Environment } from "app/commun/models/environment.model";

export const ENVIRONMENT = new InjectionToken<{ [key: string]: any }>('environment');

export function getEnvironment(): Environment {
  return environment;
}
