const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface RefreshResponse {
  success: boolean;
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}

export interface AuthError {
  success: false;
  error: string;
  code: string;
  remainingAttempts?: number;
}

class AuthService {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem("admin_refresh_token", refreshToken);
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem("admin_refresh_token");
  }

  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  async login(username: string, password: string): Promise<LoginResponse | AuthError> {
    try {
      const response = await fetch(`${API_BASE}/v1/auth/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || "Đăng nhập thất bại",
          code: data.code || "UNKNOWN_ERROR",
          remainingAttempts: data.remainingAttempts,
        };
      }

      this.setTokens(data.accessToken, data.refreshToken);

      return {
        success: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        tokenType: data.tokenType,
        expiresIn: data.expiresIn,
      };
    } catch (error) {
      return {
        success: false,
        error: "Không thể kết nối máy chủ. Vui lòng thử lại.",
        code: "NETWORK_ERROR",
      };
    }
  }

  async refresh(): Promise<boolean> {
    if (!this.refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${API_BASE}/v1/auth/admin/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        return false;
      }

      const data = await response.json();
      this.accessToken = data.accessToken;
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }

  logout() {
    this.clearTokens();
  }

  getAuthHeader(): Record<string, string> {
    return this.accessToken
      ? { Authorization: `Bearer ${this.accessToken}` }
      : {};
  }
}

export const authService = new AuthService();
export default authService;