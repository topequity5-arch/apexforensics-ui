// src/types/auth.ts

export interface UserSession {
  id: string;
  fullName: string;
  email: string;
  role: "admin" | "client";
}

export interface AuthPayload {
  user: {
    id: string;
    email: string;
    app_metadata: {
      role?: "admin" | "client";
    };
    user_metadata: {
      full_name?: string;
    };
  };
  session: {
    access_token: string;
  };
}

export interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  login: (authPayload: AuthPayload) => void;
  logout: () => void;
  loading: boolean;
}
