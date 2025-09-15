import React, { useState, useEffect } from "react";
import type { User } from "../types/types.ts";
import { AuthContext } from "./auth-context";
import { fetchWithCSRF } from "../utils/csrf.ts";
import { API_BASE_URL } from "../constants/baseUrl.ts";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ keep loading state

  const isAuthenticated = !!user;

  // 🔥 On mount, check session with Django
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/check-auth/`, {
          method: "GET",
          credentials: "include", // important so cookies are sent
        });

        if (res.ok) {
          const data = await res.json();
          if (data.is_authenticated) {
            setUser({ username: data.username } as User);
            setIsAdmin(data.username === "admin" || data.username === "younes");
          } else {
            setUser(null);
            setIsAdmin(false);
          }
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Erreur check-auth:", error);
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false); // ✅ done loading
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      const response = await fetchWithCSRF(`${API_BASE_URL}/api/logout/`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setUser(null);
        setIsAdmin(false);
        console.log("Déconnecté avec succès");
      } else {
        console.error("Erreur de déconnexion:", await response.text());
      }
    } catch (error) {
      console.error("Erreur réseau pendant logout:", error);
    }
  };

  // ✅ Prevent children from rendering until auth check finishes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        logout,
        isAdmin,
        setIsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
