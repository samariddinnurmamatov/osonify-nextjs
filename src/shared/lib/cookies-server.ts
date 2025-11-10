import { cookies } from "next/headers";

export const AUTH_TOKEN_COOKIE = "auth_access_token";
export const AUTH_REFRESH_TOKEN_COOKIE = "auth_refresh_token";
export const AUTH_USER_ID_COOKIE = "auth_user_id";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function setAuthCookies(
  accessToken: string,
  refreshToken: string,
  userId: string
) {
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_TOKEN_COOKIE, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  cookieStore.set(AUTH_REFRESH_TOKEN_COOKIE, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });

  cookieStore.set(AUTH_USER_ID_COOKIE, userId, {
    httpOnly: false, // Client-side access needed
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: MAX_AGE,
    path: "/",
  });
}

export async function getAuthCookies() {
  const cookieStore = await cookies();
  
  return {
    accessToken: cookieStore.get(AUTH_TOKEN_COOKIE)?.value,
    refreshToken: cookieStore.get(AUTH_REFRESH_TOKEN_COOKIE)?.value,
    userId: cookieStore.get(AUTH_USER_ID_COOKIE)?.value,
  };
}

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  
  cookieStore.delete(AUTH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_REFRESH_TOKEN_COOKIE);
  cookieStore.delete(AUTH_USER_ID_COOKIE);
}

