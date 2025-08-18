import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes } from './app.routes';

export const serverRoutes: ServerRoute[] = routes
  .filter((route): route is ServerRoute => route.path !== undefined)
  .map(route => ({
    ...route,
    renderMode: RenderMode.Server
  }));
