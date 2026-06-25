/* eslint-disable @typescript-eslint/no-explicit-any */
// src/services/apiService.ts

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

const API_BASE_URL = "https://apexforensics-api.onrender.com/api/v1";

// Centralized request wrapper
async function request(
  endpoint: string,
  options: RequestInit = {},
  token?: string,
) {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // GLOBAL 401 HANDLING
  // if (response.status === 401) {
  //   localStorage.removeItem("hp_token");
  //   localStorage.removeItem("hp_user");
  //   // Force redirect to login
  //   window.location.href = "/login";
  //   throw new Error("Unauthorized: Session expired.");
  // }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `API Error: ${response.statusText}`);
  }

  return response.json();
}

export const apiService = {
  // --- AUTH/USER ---
  async getUsers(token: string, params: GetUsersParams = {}) {
    const query = new URLSearchParams(params as any).toString();
    return request(`/users?${query}`, { method: "GET" }, token);
  },

  async getProfile(token: string) {
    return request("/users/profile", { method: "GET" }, token);
  },

  async updateUserRole(
    token: string,
    userId: string,
    role: "admin" | "client",
  ) {
    return request(
      "/users/role-management",
      {
        method: "PATCH",
        body: JSON.stringify({ userId, role }),
      },
      token,
    );
  },

  // --- CLAIMS ---
  async createClaim(token: string, amount: number, details: string) {
    return request(
      "/claims",
      {
        method: "POST",
        body: JSON.stringify({ amount, details }),
      },
      token,
    );
  },

  async getClaims(token: string) {
    return request("/claims", { method: "GET" }, token);
  },

  async updateClaim(token: string, claimId: string, status: string) {
    return request(
      `/claims/${claimId}`,
      {
        method: "PATCH",
        body: JSON.stringify({ status }),
      },
      token,
    );
  },

  // --- CHAT ---
  async getThreads(token: string) {
    return request("/chat/threads", { method: "GET" }, token);
  },

  async getMessages(token: string, threadId: string) {
    return request(
      `/chat/threads/${threadId}/messages`,
      { method: "GET" },
      token,
    );
  },
};
