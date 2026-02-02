import { BootstrapContext, bootstrapApplication } from "@angular/platform-browser";
import { App } from "./app/app";
import { config } from "./app/app.config.server";

/**
 * @description
 * Boots the Angular SSR app for Node runtimes.
 * Static hosting relies on the browser bundle with `index.csr.html` as the fallback entry.
 * @param {BootstrapContext} context - Angular bootstrap context from the SSR engine.
 */
const bootstrap = (context: BootstrapContext) => bootstrapApplication(App, config, context);

export default bootstrap;
