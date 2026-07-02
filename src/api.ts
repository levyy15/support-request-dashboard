import type { RequestStatus, Role, SupportRequest } from "./types";

const API_BASE_URL = "http://localhost:4000/api";

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}

export async function getRequests(simulateFailure = false) {
  const url = simulateFailure
    ? `${API_BASE_URL}/requests?fail=true`
    : `${API_BASE_URL}/requests`;

  const response = await fetch(url);
  return handleResponse<SupportRequest[]>(response);
}

export async function updateRequestStatus(
  id: string,
  status: RequestStatus,
  role: Role
) {
  const response = await fetch(`${API_BASE_URL}/requests/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status, role }),
  });

  return handleResponse<SupportRequest>(response);
}