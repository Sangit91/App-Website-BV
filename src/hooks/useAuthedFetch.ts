import { useCallback } from "react";
import { useAdmin } from "../context/AdminContext";

export function useAuthedFetch() {
  const { accessToken, refreshAccessToken } = useAdmin();

  const authedFetch = useCallback(async (
    input: RequestInfo,
    init?: RequestInit
  ): Promise<Response> => {
    const token = accessToken
      ?? localStorage.getItem("admin_token")
      ?? sessionStorage.getItem("admin_token");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(init?.headers as Record<string, string> | undefined),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    let res = await fetch(input, { ...init, headers });

    if (res.status === 401 && token) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        headers["Authorization"] = `Bearer ${newToken}`;
        res = await fetch(input, { ...init, headers });
      }
    }

    return res;
  }, [accessToken, refreshAccessToken]);

  return authedFetch;
}
