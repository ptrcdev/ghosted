import { useEffect } from "react";
import { axiosAuth } from "../lib/axios";
import { supabase } from "../lib/supabase";

const useAxiosAuth = () => {
  useEffect(() => {
    const requestIntercept = axiosAuth.interceptors.request.use(async (config) => {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });

    const responseIntercept = axiosAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error?.config;

        // Retry once on 401
        if (error?.response?.status === 401 && original && !original._retry) {
          original._retry = true;

          // Force session refresh
          await supabase.auth.refreshSession();
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;

          if (token) {
            original.headers = original.headers ?? {};
            original.headers.Authorization = `Bearer ${token}`;
            return axiosAuth(original);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosAuth.interceptors.request.eject(requestIntercept);
      axiosAuth.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosAuth;
};

export default useAxiosAuth;
