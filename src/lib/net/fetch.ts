import { useToast } from "@chakra-ui/react";

export const useFetcher = () => {
  const toast = useToast();
  const fetcher = {
    request: async (route: string, info: RequestInit): Promise<Response | null> => {
      try {
        const d = await fetch(route, info);
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
      const response = await fetcher.request(route, { method: "POST", body: JSON.stringify(body) });
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

export const routes = {
  getMe: () => "/api/users/me",
  updateMe: () => "/api/users/me",
  deleteMe: () => "/api/users/me",

  createBlock: "/api/block/create",
  block: (blockId: string) => {
    return {
      delete: () => `/api/block/${blockId}`,
      importCourse: () => `/api/block/${blockId}/import`,
      createCourse: () => `/api/block/${blockId}/course/create`,
      course: (courseId: string) => {
        return {
          delete: () => `/api/block/${blockId}/course/${courseId}`,
          get: () => `/api/block/${blockId}/course/${courseId}`,
          update: () => `/api/block/${blockId}/course/${courseId}`,
          component: (componentId: string) => {
            return {
              update: () => `/api/block/${blockId}/course/${courseId}/component/${componentId}`,
            };
          },
        };
      },
    };
  },
  auth: {
    login: () => "/api/auth/login",
  },
};
