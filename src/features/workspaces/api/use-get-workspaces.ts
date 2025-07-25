import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetrWorkspaces = () => {
  const query = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      const response = await client.api.workspaces.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch workspaces");
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
