import type { ApiResponse, ExternalDisasterFeed } from "@/types/external-disaster";

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

export async function getExternalDisasters(): Promise<ExternalDisasterFeed> {
  const response = await fetch(`${apiBaseUrl}/api/external-disasters`, {
    cache: "no-store",
  });

  return parseApiResponse<ExternalDisasterFeed>(response);
}
