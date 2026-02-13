import { Route } from "@angular/router";
import { FormsPageComponent } from "@domains/forms";

/**
 * @description
 * Routes for the Dynamic Forms domain.
 */
export const FORMS_ROUTES: Route[] = [
  {
    path: "",
    component: FormsPageComponent,
  },
];
