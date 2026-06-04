"use client";

import { jwtDecode } from "jwt-decode";

export const AUTH_TOKEN_KEY = "neighbourly.authToken";
export const AUTH_USER_KEY = "neighbourly.user";
const AUTH_EVENT = "neighbourly-auth-change";

export type AuthUser = {
  id?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  neighborhood?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type SignupPayload = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type AuthApiResponse = {
  token?: string;
  accessToken?: string;
  jwt?: string;
  user?: AuthUser;
  data?: {
    token?: string;
    accessToken?: string;
    jwt?: string;
    user?: AuthUser;
  };
  message?: string;
  error?: string;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ?? "/api";

function getAuthUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

function extractToken(response: AuthApiResponse) {
  return response.token ?? response.accessToken ?? response.jwt ?? response.data?.token ?? response.data?.accessToken ?? response.data?.jwt;
}

function extractUser(response: AuthApiResponse) {
  return response.user ?? response.data?.user ?? null;
}

async function authRequest(path: string, body: LoginPayload | SignupPayload) {
  const response = await fetch(getAuthUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as AuthApiResponse;

  if (!response.ok) {
    throw new Error(payload.message ?? payload.error ?? "Authentication failed. Please try again.");
  }

  const token = extractToken(payload);

  if (!token) {
    throw new Error("Authentication succeeded, but no token was returned by the API.");
  }

  const user = extractUser(payload);
  setAuthSession(token, user);

  return { token, user };
}

export function login(payload: LoginPayload) {
  return authRequest("/auth/login", payload);
}

export function signup(payload: SignupPayload) {
  return authRequest("/auth/register", payload);
}

export function setAuthSession(token: string, user: AuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);

  if (user) {
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_USER_KEY);
  }

  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const user = window.localStorage.getItem(AUTH_USER_KEY);

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as AuthUser;
  } catch {
    clearAuthSession();
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getAuthToken());
}

export function clearAuthSession() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export function subscribeToAuthChanges(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_EVENT, callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

export async function sendOtp(userId: string) {
  const response = await fetch(
    getAuthUrl("/auth/send-otp"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
      }),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.message ?? payload.error ?? "Failed to send OTP."
    );
  }

  return payload;
}

export async function verifyOtp(
  userId: string,
  code: string
) {
  const response = await fetch(
    getAuthUrl("/auth/verify-otp"),
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        code,
      }),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload.message ??
      payload.error ??
      "OTP verification failed."
    );
  }

  return payload;
}

type JwtPayload = {
  userId?: string;
  id?: string;
  _id?: string;
};

export function getUserIdFromToken() {
  const token = getAuthToken();

  if (!token) return null;

  try {
    const decoded = jwtDecode<JwtPayload>(token);

    console.log("Decoded Token:", decoded);

    return (
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      null
    );
  } catch {
    return null;
  }
}
