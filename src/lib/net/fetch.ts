import { useToast } from "@chakra-ui/react";
import { getCookie } from "../state/auth";

export const useApi = () => {
  const toast = useToast();
  const fetcher = {
    request: async (route: string, info: RequestInit): Promise<Response | null> => {
      try {
        const d = await fetch(route, { ...info, headers: { ...info.headers, Authorization: `Bearer ${getCookie("GK_COOKIE")}` } });
        if (!d.ok) {
          try {
            const data = await d.json();
            console.log("Error details: ", data);
            toast({
              title: "An error occurred",
              description: data.error,
            });
          } catch (e) {
            console.log("Could not serialize error into JSON: ", e);
            toast({
              title: "An error occurred.",
              description: "Could not connect to Gradekeeper.",
            });
          }
          return null;
        }

        return d;
      } catch (e) {
        toast({
          title: "An error occurred.",
          description: "Could not connect to Gradekeeper.",
        });
        return null;
      }
    },
    json: async <T>(route: string): Promise<T | null> => {
      const response = await fetcher.request(route, { method: "GET" });
      if (!response) return null;
      try {
        return await response?.json();
      } catch (e) {
        toast({
          title: "An error occurred.",
          description: "Could not connect to Gradekeeper.",
        });
        return null;
      }
    },
    post: async <T>(route: string, body: any): Promise<T | null> => {
      const response = await fetcher.request(route, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      });
      if (!response) return null;
      try {
        return await response?.json();
      } catch (e) {
        toast({
          title: "An error occurred.",
          description: "Could not connect to Gradekeeper.",
        });
        return null;
      }
    },
  };
  return fetcher;
};

export const ROUTE_BASE = import.meta.env.VITE_API_BASE_URL;
export const routes = {
  getMe: () => ROUTE_BASE + "/api/users/me",
  updateMe: () => ROUTE_BASE + "/api/users/me",
  deleteMe: () => ROUTE_BASE + "/api/users/me",

  createBlock: ROUTE_BASE + "/api/block/create",
  block: (blockId: string) => {
    return {
      delete: () => ROUTE_BASE + `/api/block/${blockId}`,
      importCourse: () => ROUTE_BASE + `/api/block/${blockId}/import`,
      createCourse: () => ROUTE_BASE + `/api/block/${blockId}/course/create`,
      course: (courseId: string) => {
        return {
          delete: () => ROUTE_BASE + `/api/block/${blockId}/course/${courseId}`,
          get: () => ROUTE_BASE + `/api/block/${blockId}/course/${courseId}`,
          update: () => ROUTE_BASE + `/api/block/${blockId}/course/${courseId}`,
          component: (componentId: string) => {
            return {
              update: () => ROUTE_BASE + `/api/block/${blockId}/course/${courseId}/component/${componentId}`,
            };
          },
        };
      },
    };
  },
  auth: {
    login: () => ROUTE_BASE + "/api/auth/login",
  },
};
