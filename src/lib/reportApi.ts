import type {
  ApiResponse,
  UserReportCreateInput,
  UserReportRecord,
} from "@/types/user-report";

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:5000";

  

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as Partial<ApiResponse<T>> & {
    error?: { message?: string };
  };

  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? "Request failed");
  }

  return body.data as T;
}





export async function createReport(
  input: UserReportCreateInput,
): Promise<UserReportRecord> {
  const response = await fetch(`${apiBaseUrl}/api/reports`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<UserReportRecord>(response);
}





export async function getReports(): Promise<UserReportRecord[]> {
  const response = await fetch(`${apiBaseUrl}/api/reports`, {
    cache: "no-store",
  });

  return parseApiResponse<UserReportRecord[]>(response);
}
