import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuthedFetch } from "../hooks/useAuthedFetch";

interface SiteContentContextType {
  content: Record<string, unknown>;
  loaded: boolean;
  getSection: <T>(key: string, fallback: T) => T;
  saveSection: (key: string, value: unknown) => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

// Deep-merge: dữ liệu từ DB (stored) đè lên fallback; key nào thiếu giữ fallback.
function deepMerge<T>(fallback: T, stored: unknown): T {
  if (stored === undefined || stored === null) return fallback;
  if (Array.isArray(fallback)) {
    return Array.isArray(stored) ? (stored as T) : fallback;
  }
  if (isPlainObject(fallback)) {
    if (!isPlainObject(stored)) return fallback;
    const merged: Record<string, unknown> = { ...fallback };
    for (const key of Object.keys(stored)) {
      const fv = fallback[key];
      const sv = stored[key];
      merged[key] = fv === undefined ? sv : deepMerge(fv, sv);
    }
    return merged as T;
  }
  return stored as T;
}

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const authedFetch = useAuthedFetch();
  const [content, setContent] = useState<Record<string, unknown>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    fetch("/api/v1/site-content")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => {
        if (mounted && body?.data) {
          setContent(body.data);
        }
      })
      .catch(() => {
        // Public nội dung: lỗi mạng → các section fallback về default trong file.
      })
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const getSection = useCallback(
    <T,>(key: string, fallback: T): T => {
      return deepMerge(fallback, content[key]);
    },
    [content]
  );

  const saveSection = useCallback(
    async (key: string, value: unknown) => {
      setContent((prev) => ({ ...prev, [key]: value }));
      const res = await authedFetch(`/api/v1/site-content/${key}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Lưu nội dung thất bại");
      }
    },
    [authedFetch]
  );

  return (
    <SiteContentContext.Provider value={{ content, loaded, getSection, saveSection }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) {
    throw new Error("useSiteContent must be used within a SiteContentProvider");
  }
  return context;
}
