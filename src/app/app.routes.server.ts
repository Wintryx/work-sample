import { RenderMode, ServerRoute } from "@angular/ssr";

/**
 * @description
 * Server-render protected routes to enable cookie-based auth checks during SSR.
 * All other routes remain prerendered for fast static delivery.
 */
export const serverRoutes: ServerRoute[] = [
  {
    path: "dashboard",
    renderMode: RenderMode.Server,
  },
  {
    path: "dashboard/items/:id",
    renderMode: RenderMode.Server,
  },
  {
    path: "**",
    renderMode: RenderMode.Prerender,
  },
];
