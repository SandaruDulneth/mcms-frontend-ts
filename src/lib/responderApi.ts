import type { ApiResponse } from '@/types/user-report';
import type { CreateResponderInput, Responder } from '@/types/responder';

const apiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ?? 'http://localhost:5000';

async function parseApiResponse<T>(response: Response): Promise<T> {
  const body = (await response.json()) as Partial<ApiResponse<T>> & {
    error?: { message?: string };
  };
  if (!response.ok || !body.success) {
    throw new Error(body.error?.message ?? 'Request failed');
  }
  return body.data as T;
}

export async function getResponders(reportId: string): Promise<Responder[]> {
  const response = await fetch(
    `${apiBaseUrl}/api/reports/${reportId}/responders`,
    { cache: 'no-store' },
  );
  return parseApiResponse<Responder[]>(response);
}

export async function createResponder(
  reportId: string,
  input: CreateResponderInput,
): Promise<Responder> {
  const response = await fetch(
    `${apiBaseUrl}/api/reports/${reportId}/responders`,
    {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify(input),
    },
  );
  return parseApiResponse<Responder>(response);
}
