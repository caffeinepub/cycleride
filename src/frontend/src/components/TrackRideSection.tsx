import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bike, Clock, MapPin, Navigation, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import LiveTrackingMap from "./LiveTrackingMap";

interface TrackRideSectionProps {
  pickup: string;
  dropoff: string;
  onClose: () => void;
}

const TOTAL_ETA_SECONDS = 180; // 3 minutes

export default function TrackRideSection({
  pickup,
  dropoff,
  onClose,
}: TrackRideSectionProps) {
  const [secondsLeft, setSecondsLeft] = useState(TOTAL_ETA_SECONDS);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const etaLabel =
    secondsLeft === 0
      ? "Arrived!"
      : `${minutes}:${String(seconds).padStart(2, "0")}`;

  return (
    <AnimatePresence>
      <motion.section
        key="track-ride"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full bg-background border-b border-border"
        data-ocid="tracking.section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground">
                  Track Your Rider
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time GPS location
                </p>
              </div>
              <Badge className="bg-primary/15 text-primary border-primary/30 flex items-center gap-1.5 ml-2">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full hover:bg-muted"
              data-ocid="tracking.close_button"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rider Info Sidebar */}
            <div className="space-y-4">
              {/* Rider Card */}
              <div
                className="bg-card border border-border rounded-2xl p-5 shadow-sm"
                data-ocid="tracking.card"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                    <Bike className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      Arjun Sharma
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mountain Bike · ⭐ 4.9
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-primary shrink-0" />
                    <div className="flex-1">
                      <span className="text-muted-foreground">ETA: </span>
                      <span
                        className={`font-bold ${secondsLeft === 0 ? "text-green-600" : "text-foreground"}`}
                      >
                        {secondsLeft === 0 ? "🎉 Arrived!" : etaLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs">Pickup</p>
                      <p className="font-medium text-foreground truncate max-w-[180px]">
                        {pickup}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 text-sm">
                    <Navigation className="w-4 h-4 text-green-mid shrink-0 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs">Drop-off</p>
                      <p className="font-medium text-foreground truncate max-w-[180px]">
                        {dropoff}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="bg-card border border-border rounded-2xl p-4">
                <div className="flex justify-between text-xs text-muted-foreground mb-2">
                  <span>Rider en route</span>
                  <span>
                    {Math.round(
                      ((TOTAL_ETA_SECONDS - secondsLeft) / TOTAL_ETA_SECONDS) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${((TOTAL_ETA_SECONDS - secondsLeft) / TOTAL_ETA_SECONDS) * 100}%`,
                    }}
                    transition={{ duration: 1 }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {secondsLeft > 0
                    ? `${minutes} min ${seconds}s remaining`
                    : "Your rider has arrived!"}
                </p>
              </div>
            </div>

            {/* Map */}
            <div
              className="lg:col-span-2 rounded-2xl overflow-hidden shadow-md"
              style={{ minHeight: 420 }}
              data-ocid="tracking.canvas_target"
            >
              <LiveTrackingMap etaSeconds={TOTAL_ETA_SECONDS} />
            </div>
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
