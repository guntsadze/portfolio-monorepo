"use client";

import { useRouter } from "next/navigation";
import Cookie from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useCallback } from "react";
import makeHttpRequest from "@/utils/makeHttpRequest";
import toast from "react-hot-toast";
import axios from "axios";

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: object;
};

function useAuth() {
  const router = useRouter();

  // ========= REGISTER =========
  const register = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }) => {
      try {
        const res = await makeHttpRequest<AuthResponse>(
          "POST",
          "/auth/register",
          data
        );

        // Tokens & User -> Cookie
        Cookie.set("accessToken", res.accessToken, { path: "/", expires: 1 });
        Cookie.set("refreshToken", res.refreshToken, { path: "/", expires: 7 });
        Cookie.set("user", JSON.stringify(res.user), { path: "/", expires: 1 });

        // router.push("/dashboard");
        return res;
      } catch (error: any) {
        throw new Error(error.message || "Registration failed");
      }
    },
    [router]
  );

  // ========= LOGIN =========
  const login = useCallback(
    async (data: { email: string; password: string }) => {
      try {
        const res = await makeHttpRequest<AuthResponse>(
          "POST",
          "/auth/login",
          data
        );

        Cookie.set("accessToken", res.accessToken, { path: "/", expires: 1 });
        Cookie.set("refreshToken", res.refreshToken, { path: "/", expires: 7 });
        Cookie.set("user", JSON.stringify(res.user), { path: "/", expires: 1 });

        const token = Cookie.get("accessToken"); // js cookie
        const respMenu = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/menu/getUserMenu`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("respMenu", respMenu.data);

        // router.push("/dashboard");
        return res;
      } catch (error: any) {
        const message =
          error?.response?.data?.message || error.message || "Login failed";
        toast.error(message);
        throw error;
      }
    },
    [router]
  );

  // ========= LOGOUT =========
  const logout = useCallback(() => {
    Cookie.remove("accessToken");
    Cookie.remove("refreshToken");
    Cookie.remove("user");
    router.push("/login");
  }, [router]);

  return { register, login, logout };
}

export default useAuth;
