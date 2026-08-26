import type { ApiResponse } from "@/types/user-report";
import type { AdminStats } from "@/types/admin-stats";
import type { Responder, ResponderStatus } from "@/types/responder";
import type { ReportStatus, UserReportRecord } from "@/types/user-report";
import { getAdminToken, removeAdminToken } from "@/lib/auth";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000";

function getAuthHeaders(): Record<string, string> {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function parseApiResponse<T>(response: Response): Promise<T> {
  if (response.status === 401) {
    removeAdminToken();
    if (
      typeof window !== "undefined" &&
      window.location.pathname.startsWith("/admin") &&
      window.location.pathname !== "/admin/login"
    ) {
      window.location.href = "/admin/login";
    }
  }

  const body = (await response.json()) as Partial<ApiResponse<T>> & {
    error?: { message?: string };
  };

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Request failed");
  }

  return body.data as T;
}

// ── Admin Login ──────────────────────────────────────────────────────────────

export async function loginAdmin(
  username: string,
  password: string,
): Promise<{ token: string; admin: { username: string } }> {
  const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  return parseApiResponse<{ token: string; admin: { username: string } }>(
    response,
  );
}

// ── Stats ────────────────────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  const response = await fetch(`${apiBaseUrl}/api/admin/stats`, {
    cache: "no-store",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseApiResponse<AdminStats>(response);
}

export async function getAdminReports(): Promise<UserReportRecord[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/reports`, {
    cache: "no-store",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseApiResponse<UserReportRecord[]>(response);
}

// ── All responders (admin view) ──────────────────────────────────────────────

export async function getAllResponders(): Promise<Responder[]> {
  const response = await fetch(`${apiBaseUrl}/api/admin/responders`, {
    cache: "no-store",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseApiResponse<Responder[]>(response);
}

// ── Report status update ─────────────────────────────────────────────────────

export async function updateReportStatus(
  id: string,
  status: ReportStatus,
): Promise<UserReportRecord> {
  const response = await fetch(`${apiBaseUrl}/api/reports/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ status }),
  });
  return parseApiResponse<UserReportRecord>(response);
}

// ── Delete report ────────────────────────────────────────────────────────────

export async function deleteReport(
  id: string,
): Promise<{ deletedId: string }> {
  const response = await fetch(`${apiBaseUrl}/api/reports/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(),
    },
  });
  return parseApiResponse<{ deletedId: string }>(response);
}

// ── Responder status update ──────────────────────────────────────────────────

export async function updateResponderStatus(
  reportId: string,
  responderId: string,
  status: ResponderStatus,
): Promise<Responder> {
  const response = await fetch(
    `${apiBaseUrl}/api/reports/${reportId}/responders/${responderId}/status`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      },
      body: JSON.stringify({ status }),
    },
  );
  return parseApiResponse<Responder>(response);
}
