import { Toaster } from "@/components/ui/sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import type { RiderProfile } from "./backend";
import AuthModal from "./components/AuthModal";
import FeatureStrip from "./components/FeatureStrip";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import Navbar from "./components/Navbar";
import PricingSection from "./components/PricingSection";
import ProfileSetupModal from "./components/ProfileSetupModal";
import RidersSection from "./components/RidersSection";
import TrackRideSection from "./components/TrackRideSection";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useGetCallerUserProfile } from "./hooks/useQueries";

export default function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [prefillPickup, setPrefillPickup] = useState("");
  const [prefillDropoff, setPrefillDropoff] = useState("");
  const [activeRide, setActiveRide] = useState<{
    pickup: string;
    dropoff: string;
  } | null>(null);

  const { identity, clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched: profileFetched,
  } = useGetCallerUserProfile();
  const showProfileSetup =
    isAuthenticated &&
    !profileLoading &&
    profileFetched &&
    userProfile === null;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    toast.success("Logged out successfully.");
  };

  const handleOpenAuth = (mode: "login" | "signup" = "login") => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleBookRider = (_rider: RiderProfile) => {
    setPrefillPickup("Current Location");
    setPrefillDropoff("");
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (!isAuthenticated) {
      handleOpenAuth("login");
    }
  };

  const handleRideBooked = (pickup: string, dropoff: string) => {
    setActiveRide({ pickup, dropoff });
    // Scroll to tracking section
    setTimeout(() => {
      document
        .getElementById("track-ride-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" richColors />

      <Navbar
        onLogin={() => handleOpenAuth("login")}
        onSignup={() => handleOpenAuth("signup")}
        isAuthenticated={isAuthenticated}
        userName={userProfile?.name}
        onLogout={handleLogout}
      />

      <main className="flex-1">
        <HeroSection
          onAuthRequired={() => handleOpenAuth("login")}
          isAuthenticated={isAuthenticated}
          prefillPickup={prefillPickup}
          prefillDropoff={prefillDropoff}
          onClearPrefill={() => {
            setPrefillPickup("");
            setPrefillDropoff("");
          }}
          onRideBooked={handleRideBooked}
        />

        {activeRide && (
          <div id="track-ride-section">
            <TrackRideSection
              pickup={activeRide.pickup}
              dropoff={activeRide.dropoff}
              onClose={() => setActiveRide(null)}
            />
          </div>
        )}

        <RidersSection onBookRider={handleBookRider} />
        <FeatureStrip />
        <PricingSection onGetStarted={() => handleOpenAuth("signup")} />
        <HowItWorks />
      </main>

      <Footer />

      <AuthModal
        open={authOpen}
        onOpenChange={setAuthOpen}
        defaultMode={authMode}
      />

      <ProfileSetupModal open={showProfileSetup} />
    </div>
  );
}
