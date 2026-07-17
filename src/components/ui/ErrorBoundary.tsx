import React, { useState, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import Button from "./Button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function ErrorBoundary({ children, fallback }: Props) {
  const [hasError, setHasError] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  React.useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.error?.message || "Unknown error"));
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  if (hasError) {
    if (fallback) {
      return fallback;
    }

    return (
      <div className="min-h-[400px] flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-green-dark mb-2">
            Đã xảy ra lỗi
          </h2>
          <p className="text-ink/70 text-sm mb-4">
            Rất tiếc, đã có lỗi không mong muốn xảy ra. Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề persists.
          </p>
          {error && (
            <p className="text-xs text-ink/50 mb-4 font-mono">
              {error.message}
            </p>
          )}
          <Button variant="primary" onClick={() => window.location.reload()}>
            <RefreshCw size={14} />
            Tải lại trang
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}