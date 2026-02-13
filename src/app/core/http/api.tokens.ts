import { InjectionToken } from "@angular/core";

/**
 * @description
 * Injection Token for the Base API URL.
 * High-level abstraction to decouple services from environment files.
 */
export const API_BASE_URL = new InjectionToken<string>("API_BASE_URL");
