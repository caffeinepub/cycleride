import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Clock, Loader2, MapPin, Navigation } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { RiderProfile } from "../backend";
import { useBookRide } from "../hooks/useQueries";
import { HeroMapSVG } from "./MapSVG";

interface HeroSectionProps {
  onAuthRequired: () => void;
  isAuthenticated: boolean;
  prefillPickup?: string;
  prefillDropoff?: string;
  onClearPrefill?: () => void;
  onRideBooked?: (pickup: string, dropoff: string) => void;
}

export default function HeroSection({
  onAuthRequired,
  isAuthenticated,
  prefillPickup,
  prefillDropoff,
  onClearPrefill,
  onRideBooked,
}: HeroSectionProps) {
  const [pickup, setPickup] = useState(prefillPickup || "");
  const [dropoff, setDropoff] = useState(prefillDropoff || "");
  const bookRide = useBookRide();

  const handleBook = async () => {
    if (!isAuthenticated) {
      onAuthRequired();
      return;
    }
    if (!pickup.trim() || !dropoff.trim()) {
      toast.error("Please enter pickup and drop-off locations");
      return;
    }
    try {
      const result = await bookRide.mutateAsync({
        pickupLocation: pickup,
        dropOffLocation: dropoff,
        rideTime: BigInt(Date.now()) * BigInt(1_000_000),
      });
      if (result) {
        toast.success("🚴 Ride booked! A cyclist is on the way.", {
          description: `From ${pickup} to ${dropoff}`,
        });
        const bookedPickup = pickup;
        const bookedDropoff = dropoff;
        setPickup("");
        setDropoff("");
        onClearPrefill?.();
        onRideBooked?.(bookedPickup, bookedDropoff);
      } else {
        toast.error("Booking failed. Please try again.");
      }
    } catch {
      toast.error("Booking failed. Please try again.");
    }
  };

  return (
    <section
      className="relative min-h-[90vh] flex items-center"
      style={{
        backgroundImage:
          "url('/assets/generated/hero-cyclist.dim_1600x900.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 55%, rgba(0,0,0,0.08) 100%)",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text + Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 bg-primary/20 backdrop-blur-sm text-green-200 border border-green-400/30 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Eco-Friendly Rides
              </span>
            </div>
            <h1 className="font-heading text-5xl sm:text-6xl font-extrabold text-white leading-tight mb-5">
              Ride Green,
              <br />
              <span className="text-green-400">Ride Free.</span>
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md leading-relaxed">
              Book a certified cycle rider in seconds. Fast, affordable, and
              zero emissions. Your city, pedal-powered.
            </p>

            {/* Booking Form Card */}
            <div
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md"
              data-ocid="booking.card"
            >
              <h2 className="font-heading font-bold text-lg text-foreground mb-4">
                Book Your Ride
              </h2>
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input
                    placeholder="Pickup location"
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-10 border-border focus:ring-primary"
                    data-ocid="booking.pickup_input"
                  />
                </div>
                <div className="relative">
                  <Navigation className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-mid" />
                  <Input
                    placeholder="Drop-off location"
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="pl-10 border-border focus:ring-primary"
                    data-ocid="booking.dropoff_input"
                    onKeyDown={(e) => e.key === "Enter" && handleBook()}
                  />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Average arrival: 3–7 minutes</span>
                </div>
                <Button
                  onClick={handleBook}
                  disabled={bookRide.isPending}
                  data-ocid="booking.submit_button"
                  className="w-full bg-primary hover:bg-green-deep/90 text-primary-foreground font-bold uppercase tracking-wider h-11 rounded-xl text-sm"
                >
                  {bookRide.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Booking...
                    </>
                  ) : (
                    "REQUEST A CYCLE"
                  )}
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Right: Map Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="hidden lg:block"
          >
            <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-5 pt-5 pb-3 flex items-center justify-between">
                <div>
                  <h3 className="font-heading font-bold text-base text-foreground">
                    Available Riders Nearby
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    5 cyclists within 2 km
                  </p>
                </div>
                <span className="flex items-center gap-1.5 bg-secondary text-primary text-xs font-semibold px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  Live
                </span>
              </div>
              <div className="px-3 pb-4" style={{ height: 260 }}>
                <HeroMapSVG />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
