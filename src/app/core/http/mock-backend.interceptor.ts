import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from "@angular/common/http";
import { delay, mergeMap, of, throwError, timer } from "rxjs";
import { DashboardErrorCode, DashboardItemDto, ItemStatus } from "@domains/dashboard";
import { inject } from "@angular/core";
import { API_BASE_URL } from "@core/http/api.tokens";
import { AuthErrorCode } from "@core/auth";
import { FieldType, FormConfig } from "@domains/forms";

/**
 * @description
 * Mock data typed with DashboardItemDto to ensure contract consistency.
 */
const MOCK_DASHBOARD_DATA: DashboardItemDto[] = [
  { id: "1", title: "Feature: Login Logic", status: ItemStatus.Done, progress: 100 },
  { id: "2", title: "Feature: Dashboard Table", status: ItemStatus.InProgress, progress: 45 },
  { id: "3", title: "Feature: Unit Tests", status: ItemStatus.Todo, progress: 0 },
  { id: "4", title: "Feature: SSR Guard", status: ItemStatus.Done, progress: 100 },
  { id: "5", title: "Feature: Notifications", status: ItemStatus.InProgress, progress: 70 },
  { id: "6", title: "Feature: Auth Tokens", status: ItemStatus.InProgress, progress: 55 },
  { id: "7", title: "Feature: Layout Shell", status: ItemStatus.Done, progress: 100 },
  { id: "8", title: "Feature: Item Detail", status: ItemStatus.Done, progress: 100 },
  { id: "9", title: "Feature: Resolver Loading", status: ItemStatus.Done, progress: 100 },
  { id: "10", title: "Feature: Mock Backend", status: ItemStatus.InProgress, progress: 60 },
  { id: "11", title: "Feature: Error Handling", status: ItemStatus.InProgress, progress: 50 },
  { id: "12", title: "Feature: Auth Guards", status: ItemStatus.Done, progress: 100 },
  { id: "13", title: "Feature: Table Actions", status: ItemStatus.InProgress, progress: 35 },
  { id: "14", title: "Feature: Status Badges", status: ItemStatus.Done, progress: 100 },
  { id: "15", title: "Feature: Responsive Layout", status: ItemStatus.InProgress, progress: 40 },
  { id: "16", title: "Feature: Code Quality", status: ItemStatus.Done, progress: 100 },
  { id: "17", title: "Feature: Data Mapping", status: ItemStatus.Done, progress: 100 },
  { id: "18", title: "Feature: State Management", status: ItemStatus.InProgress, progress: 65 },
  { id: "19", title: "Feature: Testing Strategy", status: ItemStatus.InProgress, progress: 30 },
  { id: "20", title: "Feature: Release Checklist", status: ItemStatus.Todo, progress: 0 },
];

const MOCK_FORM_USER_PROFILE: FormConfig = {
  id: "user-profile",
  title: "User Profile",
  description: "Edit your personal information and preferences.",
  fields: [
    {
      key: "username",
      type: FieldType.Text,
      label: "Username",
      placeholder: "jdoe",
      grid: { default: 6, md: 6 },
      validators: [
        { type: "required" },
        {
          type: "min",
          value: 2,
          message: "Username must be at least 2 characters.",
        },
      ],
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "email",
      type: FieldType.Email,
      label: "Email Address",
      placeholder: "john.doe@example.com",
      grid: { default: 6, md: 6 },
      validators: [{ type: "required" }, { type: "email" }],
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "phone",
      type: FieldType.Phone,
      label: "Phone Number",
      placeholder: "+1 234 567 890",
      grid: { default: 6, md: 6 },
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "role",
      type: FieldType.Select,
      label: "Role",
      grid: { default: 6, md: 6 },
      options: [
        { label: "Admin", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Viewer", value: "viewer" },
      ],
      validators: [{ type: "required" }],
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "notifications",
      type: FieldType.Switch,
      label: "Enable Notifications",
      value: true,
      grid: { default: 6 },
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "newsletter",
      type: FieldType.Checkbox,
      label: "Subscribe to Newsletter",
      value: false,
      grid: { default: 6 },
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "gender",
      type: FieldType.Radio,
      label: "Gender",
      grid: { default: 6 },
      options: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "avatar",
      type: FieldType.File,
      label: "Profile Picture",
      accept: "image/*",
      multiple: true,
      grid: { default: 6 },
      permissions: { hidden: false, readonly: false },
    },
    {
      key: "internalId",
      type: FieldType.Text,
      label: "Internal ID (Readonly)",
      value: "UUID-1234-5678",
      grid: { default: 12 },
      permissions: { hidden: false, readonly: true },
    },
  ],
};

/**
 * @description
 * Mock Backend Interceptor to simulate REST API responses.
 * Essential for the Work Sample to demonstrate UI interactions without a real server.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method } = req;
  const baseUrl = inject(API_BASE_URL);

  // --- Dashboard Endpoints ---

  if (url.endsWith(`${baseUrl}/dashboard/items`) && method === "GET") {
    const debugCode = req.params.get("debug");
    if (debugCode === DashboardErrorCode.Unauthorized) {
      return timer(800).pipe(
        mergeMap(() =>
          throwError(
            () =>
              new HttpErrorResponse({
                status: 401,
                statusText: "Unauthorized",
                error: {
                  status: 401,
                  message: "Session expired. Please log in again.",
                  code: DashboardErrorCode.Unauthorized,
                },
              }),
          ),
        ),
      );
    }

    return of(
      new HttpResponse({
        status: 200,
        body: MOCK_DASHBOARD_DATA,
      }),
    ).pipe(delay(800));
  }

  // --- Dynamic Forms Endpoints ---

  if (url.endsWith(`${baseUrl}/forms/user-profile`) && method === "GET") {
    return of(
      new HttpResponse({
        status: 200,
        body: MOCK_FORM_USER_PROFILE,
      }),
    ).pipe(delay(600));
  }

  if (url.includes(`${baseUrl}/forms/`) && url.endsWith("/submit") && method === "POST") {
    console.log("Mock Backend: Received form submission", req.body);
    return of(
      new HttpResponse({
        status: 200,
        body: { message: "Profile updated successfully!" },
      }),
    ).pipe(delay(1000));
  }

  if (url.endsWith(`${baseUrl}/upload`) && method === "POST") {
    return of(
      new HttpResponse({
        status: 201,
        body: {
          id: crypto.randomUUID(),
          url: "https://via.placeholder.com/150",
          filename: "uploaded-file.jpg",
          timestamp: new Date().toISOString(),
        },
      }),
    ).pipe(delay(1500)); // Simulate upload time
  }

  // --- Debug Endpoints ---

  if (url === `${baseUrl}/debug/error` && method === "GET") {
    return timer(800).pipe(
      mergeMap(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 500,
              statusText: "Internal Server Error",
              error: {
                status: 500,
                message: "Simulated API failure for debugging purposes.",
                code: DashboardErrorCode.ItemsLoadFailed,
              },
            }),
        ),
      ),
    );
  }

  if (url === `${baseUrl}/debug/unauthorized` && method === "GET") {
    return timer(800).pipe(
      mergeMap(() =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: "Unauthorized",
              error: {
                status: 401,
                message: "Session expired. Please log in again.",
                code: AuthErrorCode.Unauthorized,
              },
            }),
        ),
      ),
    );
  }

  if (url === `${baseUrl}/debug/success` && method === "GET") {
    return of(
      new HttpResponse({
        status: 200,
        body: {
          status: 200,
          message: "Simulated success notification.",
        },
      }),
    ).pipe(delay(800));
  }

  return next(req);
};
