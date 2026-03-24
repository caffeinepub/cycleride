import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import type { RiderProfile } from "../backend";
import { useGetAllRiders } from "../hooks/useQueries";
import { LiveTrackSVG } from "./MapSVG";

const FALLBACK_RIDERS: RiderProfile[] = [
  {
    name: "Arjun Sharma",
    rating: 4.9,
    distance: 0.3,
    isAvailable: true,
    photoUrl: "",
    coordinates: undefined,
  },
  {
    name: "Priya Patel",
    rating: 4.8,
    distance: 0.7,
    isAvailable: true,
    photoUrl: "",
    coordinates: undefined,
  },
  {
    name: "Rahul Verma",
    rating: 4.7,
    distance: 1.1,
    isAvailable: true,
    photoUrl: "",
    coordinates: undefined,
  },
  {
    name: "Neha Singh",
    rating: 4.6,
    distance: 1.4,
    isAvailable: false,
    photoUrl: "",
    coordinates: undefined,
  },
];

const AVATAR_COLORS = [
  "from-green-500 to-emerald-700",
  "from-teal-500 to-cyan-700",
  "from-lime-500 to-green-700",
  "from-emerald-400 to-teal-600",
];

const STAR_INDICES = [0, 1, 2, 3, 4];

function RiderCard({
  rider,
  index,
  onBook,
}: {
  rider: RiderProfile;
  index: number;
  onBook: (rider: RiderProfile) => void;
}) {
  const initials = rider.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const gradient = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const stars = Math.round(rider.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      data-ocid={`riders.item.${index + 1}`}
      className="bg-white rounded-xl border border-border p-4 shadow-card hover:shadow-card-hover transition-shadow flex flex-col gap-3"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-bold text-base flex-shrink-0`}
        >
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-foreground text-sm truncate">
            {rider.name}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            {STAR_INDICES.map((i) => (
              <Star
                key={`star-${i}`}
                className={`w-3 h-3 ${i < stars ? "text-amber-400 fill-amber-400" : "text-muted-foreground"}`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              {rider.rating.toFixed(1)}
            </span>
          </div>
        </div>
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            rider.isAvailable
              ? "bg-secondary text-primary border border-primary/20"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {rider.isAvailable ? "Available" : "Busy"}
        </span>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <MapPin className="w-3.5 h-3.5 text-primary" />
        <span>{rider.distance.toFixed(1)} km away</span>
      </div>
      <Button
        size="sm"
        disabled={!rider.isAvailable}
        onClick={() => onBook(rider)}
        data-ocid={`riders.book_button.${index + 1}`}
        className="w-full bg-primary text-primary-foreground hover:bg-green-deep/90 disabled:opacity-50 text-xs font-semibold rounded-lg"
      >
        Book Now
      </Button>
    </motion.div>
  );
}

interface RidersSectionProps {
  onBookRider: (rider: RiderProfile) => void;
}

export default function RidersSection({ onBookRider }: RidersSectionProps) {
  const { data: riders, isLoading } = useGetAllRiders();
  const displayRiders = (
    riders && riders.length > 0 ? riders : FALLBACK_RIDERS
  ).slice(0, 4);

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Riders Grid */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
                Available Riders Nearby
              </h2>
              <p className="text-muted-foreground text-sm">
                Certified cyclists ready to ride with you right now.
              </p>
            </motion.div>

            {isLoading ? (
              <div
                className="flex items-center justify-center h-48"
                data-ocid="riders.loading_state"
              >
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-ocid="riders.list"
              >
                {displayRiders.map((rider, i) => (
                  <RiderCard
                    key={rider.name}
                    rider={rider}
                    index={i}
                    onBook={onBookRider}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right: Live Track */}
          <div id="track">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <h2 className="font-heading font-bold text-3xl text-foreground mb-2">
                Track Your Ride Live
              </h2>
              <p className="text-muted-foreground text-sm">
                Real-time GPS tracking from pickup to destination.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl border border-border shadow-card overflow-hidden"
            >
              <Tabs defaultValue="booked">
                <div className="px-4 pt-4">
                  <TabsList className="bg-secondary h-8 rounded-lg">
                    <TabsTrigger
                      value="booked"
                      className="text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                      data-ocid="track.booked_tab"
                    >
                      Booked Rider
                    </TabsTrigger>
                    <TabsTrigger
                      value="routes"
                      className="text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                      data-ocid="track.routes_tab"
                    >
                      Routes
                    </TabsTrigger>
                    <TabsTrigger
                      value="eta"
                      className="text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                      data-ocid="track.eta_tab"
                    >
                      ETA
                    </TabsTrigger>
                    <TabsTrigger
                      value="distance"
                      className="text-xs h-6 data-[state=active]:bg-primary data-[state=active]:text-white"
                      data-ocid="track.distance_tab"
                    >
                      Distance
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="booked" className="m-0">
                  <div className="p-4 pb-2" style={{ height: 260 }}>
                    <LiveTrackSVG />
                  </div>
                  <div className="px-4 pb-4 grid grid-cols-3 gap-3">
                    {[
                      { label: "Distance", value: "2.4 km" },
                      { label: "ETA", value: "4 min" },
                      { label: "Speed", value: "14 km/h" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="text-center bg-secondary rounded-xl p-2"
                      >
                        <p className="text-primary font-bold text-base font-heading">
                          {stat.value}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="routes" className="m-0 p-4">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select an active ride to view route details.
                  </p>
                </TabsContent>
                <TabsContent value="eta" className="m-0 p-4">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Book a ride to see real-time ETA.
                  </p>
                </TabsContent>
                <TabsContent value="distance" className="m-0 p-4">
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Distance tracking available during active rides.
                  </p>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
