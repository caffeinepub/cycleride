import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types
  type Coordinates = {
    lat : Float;
    long : Float;
  };

  type BasicRide = {
    userId : Principal;
    pickupLocation : Text;
    dropOffLocation : Text;
    rideTime : Time.Time;
  };

  type RideRequest = {
    pickupLocation : Text;
    dropOffLocation : Text;
    rideTime : Time.Time; // Use 0 for immediate ride
  };

  // Sort module with comparison functions for sorting
  module Ride {
    public func compareByTime(ride1 : BasicRide, ride2 : BasicRide) : Order.Order {
      Int.compare(ride1.rideTime, ride2.rideTime);
    };
  };

  // Rider Profile
  type RiderProfile = {
    name : Text;
    rating : Float;
    distance : Float;
    isAvailable : Bool;
    photoUrl : Text;
    coordinates : ?Coordinates;
  };

  module RiderProfile {
    public func compareByName(rider1 : RiderProfile, rider2 : RiderProfile) : Order.Order {
      Text.compare(rider1.name, rider2.name);
    };
  };

  // Pricing Plan
  type PricingPlan = {
    name : Text;
    price : Nat;
    features : [Text];
  };

  module PricingPlan {
    public func compareByName(plan1 : PricingPlan, plan2 : PricingPlan) : Order.Order {
      Text.compare(plan1.name, plan2.name);
    };
  };

  // Ride
  type Ride = {
    user : Principal;
    startLocation : Coordinates;
    destination : Coordinates;
    timestamp : Time.Time;
  };

  // User Profile
  public type UserProfile = {
    name : Text;
    email : ?Text;
    phone : ?Text;
  };

  // State Initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Storage Maps
  let riderProfiles = Map.empty<Text, RiderProfile>();
  let pricingPlans = Map.empty<Text, PricingPlan>();
  let rides = List.empty<BasicRide>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Initialization - sets up the first admin
  public shared ({ caller }) func initialize(adminToken : Text, userProvidedToken : Text) : async () {
    AccessControl.initialize(accessControlState, caller, adminToken, userProvidedToken);
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Internal Helpers
  func assertUniqueId(id : Text) {
    if (riderProfiles.containsKey(id)) {
      Runtime.trap("Rider with id " # id # " already exists");
    };
  };

  // Add Rider Profile (Internal Use Only)
  func addRiderProfileInternal(id : Text, profile : RiderProfile) {
    assertUniqueId(id);
    riderProfiles.add(id, profile);
  };

  // Get All Riders Helper
  func getAllRidersInternal() : [RiderProfile] {
    riderProfiles.values().toArray();
  };

  // Public Functions

  // Add Rider Profile (Admin Only)
  public shared ({ caller }) func addRiderProfile(_id : Text, _profile : RiderProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can add rider profiles");
    };
    addRiderProfileInternal(_id, _profile);
  };

  // Update Rider Location (Admin Only)
  public shared ({ caller }) func updateRiderLocation(_id : Text, _coords : Coordinates) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update rider locations");
    };
    switch (riderProfiles.get(_id)) {
      case null {
        Runtime.trap("Rider not found");
      };
      case (?rider) {
        let updatedRider = {
          name = rider.name;
          rating = rider.rating;
          distance = rider.distance;
          isAvailable = rider.isAvailable;
          photoUrl = rider.photoUrl;
          coordinates = ?_coords;
        };
        riderProfiles.add(_id, updatedRider);
      };
    };
  };

  // Book Ride (User Only)
  public shared ({ caller }) func bookRide(request : RideRequest) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can book rides");
    };
    rides.add({
      userId = caller;
      pickupLocation = request.pickupLocation;
      dropOffLocation = request.dropOffLocation;
      rideTime = request.rideTime;
    });
    true;
  };

  // Get All Riders (Public - anyone can view available riders)
  public query ({ caller }) func getAllRiders() : async [RiderProfile] {
    riderProfiles.values().map(func(rider) { rider }).toArray().sort(RiderProfile.compareByName);
  };

  // Get All Pricing Plans (Public - anyone can view pricing)
  public query ({ caller }) func getAllPricingPlans() : async [PricingPlan] {
    pricingPlans.values().toArray().sort(PricingPlan.compareByName);
  };

  // Get User Position (User can only access their own, admin can access any)
  public query ({ caller }) func getUserPosition(_userId : Principal) : async {
    #location : Coordinates;
    #notAvailable : ();
  } {
    if (caller != _userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own position");
    };
    #notAvailable;
  };

  // Get All Rides (Admin Only - privacy sensitive)
  public query ({ caller }) func getAllRides() : async [BasicRide] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all rides");
    };
    rides.toArray().sort(func(ride1, ride2) { Int.compare(ride1.rideTime, ride2.rideTime) });
  };

  // Update Available Riders (Admin Only)
  public shared ({ caller }) func updateAvailableRiders() : async [RiderProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update available riders");
    };
    getAllRidersInternal();
  };

  // Get Nearby Rides (Public - returns available riders near location)
  public query ({ caller }) func getNearbyRides(_location : Coordinates, _radius : Float) : async [RiderProfile] {
    getAllRidersInternal();
  };

  // Get All Rides Internal (Admin Only)
  public query ({ caller }) func getAllRidesInternal() : async [BasicRide] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access internal ride data");
    };
    rides.values().toArray();
  };

  // Get Rides For User (User can only view their own, admin can view any)
  public query ({ caller }) func getRidesForUser(userId : Principal) : async [BasicRide] {
    if (caller != userId and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own ride history");
    };
    rides.toArray().filter(func(ride) { ride.userId == userId });
  };

  // Seed Data Function (Admin Only)
  public shared ({ caller }) func initializeSeedData() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can initialize seed data");
    };
    // Seed Rider Profiles
    addRiderProfileInternal(
      "alice",
      {
        name = "Alice";
        rating = 4.5;
        distance = 1.2;
        isAvailable = true;
        photoUrl = "/alice.jpg";
        coordinates = null;
      },
    );
    addRiderProfileInternal(
      "bob",
      {
        name = "Bob";
        rating = 4.6;
        distance = 0.8;
        isAvailable = true;
        photoUrl = "/bob.jpg";
        coordinates = null;
      },
    );
    addRiderProfileInternal(
      "carol",
      {
        name = "Carol";
        rating = 4.5;
        distance = 1.2;
        isAvailable = false;
        photoUrl = "/carol.jpg";
        coordinates = null;
      },
    );

    // Seed Pricing Plans
    pricingPlans.add(
      "City Hopper",
      {
        name = "City Hopper";
        price = 5000; // 50.00
        features = ["10 Rides", "Valid for 7 days", "Shareable"];
      },
    );
    pricingPlans.add(
      "Day Cruiser",
      {
        name = "Day Cruiser";
        price = 700; // 7.00
        features = ["Unlimited Rides", "Valid for 24 hours"];
      },
    );
    pricingPlans.add(
      "Monthly Pass",
      {
        name = "Monthly Pass";
        price = 4000; // 40.00
        features = ["Unlimited Rides", "Valid for 30 days"];
      },
    );
  };
};
