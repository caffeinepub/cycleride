import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export interface RiderProfile {
    name: string;
    isAvailable: boolean;
    photoUrl: string;
    distance: number;
    rating: number;
    coordinates?: Coordinates;
}
export interface Coordinates {
    lat: number;
    long: number;
}
export interface BasicRide {
    dropOffLocation: string;
    userId: Principal;
    rideTime: Time;
    pickupLocation: string;
}
export interface RideRequest {
    dropOffLocation: string;
    rideTime: Time;
    pickupLocation: string;
}
export interface PricingPlan {
    features: Array<string>;
    name: string;
    price: bigint;
}
export interface UserProfile {
    name: string;
    email?: string;
    phone?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addRiderProfile(_id: string, _profile: RiderProfile): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    bookRide(request: RideRequest): Promise<boolean>;
    getAllPricingPlans(): Promise<Array<PricingPlan>>;
    getAllRiders(): Promise<Array<RiderProfile>>;
    getAllRides(): Promise<Array<BasicRide>>;
    getAllRidesInternal(): Promise<Array<BasicRide>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getNearbyRides(_location: Coordinates, _radius: number): Promise<Array<RiderProfile>>;
    getRidesForUser(userId: Principal): Promise<Array<BasicRide>>;
    getUserPosition(_userId: Principal): Promise<{
        __kind__: "notAvailable";
        notAvailable: null;
    } | {
        __kind__: "location";
        location: Coordinates;
    }>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initialize(adminToken: string, userProvidedToken: string): Promise<void>;
    initializeSeedData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateAvailableRiders(): Promise<Array<RiderProfile>>;
    updateRiderLocation(_id: string, _coords: Coordinates): Promise<void>;
}
