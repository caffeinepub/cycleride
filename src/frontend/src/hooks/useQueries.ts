import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { RideRequest } from "../backend";
import { useActor } from "./useActor";

export function useGetAllRiders() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["riders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRiders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPricingPlans() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["pricingPlans"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPricingPlans();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const query = useQuery({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useBookRide() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (request: RideRequest) => {
      if (!actor) throw new Error("Not authenticated");
      return actor.bookRide(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rides"] });
    },
  });
}

export function useGetRideHistory(userId?: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["rideHistory", userId],
    queryFn: async () => {
      if (!actor || !userId) return [];
      return actor.getAllRides();
    },
    enabled: !!actor && !isFetching && !!userId,
  });
}
