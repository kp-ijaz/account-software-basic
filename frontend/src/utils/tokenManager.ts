/**
 * Token Manager - Handles authentication token persistence and validation
 */

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const TOKEN_EXPIRY_KEY = 'auth_token_expiry';

export class TokenManager {
  /**
   * Save token to localStorage
   */
  static saveToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  /**
   * Save user to localStorage
   */
  static saveUser(user: any): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  /**
   * Get token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get user from localStorage
   */
  static getUser(): any {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Clear token and user from localStorage
   */
  static clearAuth(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
  }

  /**
   * Check if token exists
   */
  static isTokenAvailable(): boolean {
    return !!this.getToken();
  }

  /**
   * Decode JWT token to check expiry (basic decoding)
   * Returns the payload if valid, null otherwise
   */
  static decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token: string): boolean {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return true;
      }

      // Check if token expires in the next 5 minutes
      const expiryTime = decoded.exp * 1000;
      const currentTime = new Date().getTime();
      const timeUntilExpiry = expiryTime - currentTime;

      // If expires in less than 5 minutes, consider it expired
      return timeUntilExpiry < 5 * 60 * 1000;
    } catch {
      return true;
    }
  }

  /**
   * Get time remaining until token expires (in milliseconds)
   */
  static getTokenExpiryTime(token: string): number | null {
    try {
      const decoded = this.decodeToken(token);
      if (!decoded || !decoded.exp) {
        return null;
      }

      const expiryTime = decoded.exp * 1000;
      const currentTime = new Date().getTime();
      return Math.max(0, expiryTime - currentTime);
    } catch {
      return null;
    }
  }

  /**
   * Restore auth state from localStorage
   */
  static restoreAuth(): { token: string | null; user: any } {
    const token = this.getToken();
    const user = this.getUser();

    // If token exists but is expired, clear it
    if (token && this.isTokenExpired(token)) {
      this.clearAuth();
      return { token: null, user: null };
    }

    return { token, user };
  }

  /**
   * Save complete auth data
   */
  static saveAuthData(token: string, user: any): void {
    this.saveToken(token);
    this.saveUser(user);
  }
}

export default TokenManager;
