import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { PricingPlan } from "../backend";
import { useGetPricingPlans } from "../hooks/useQueries";

type VehicleFilter = "All" | "Cycle" | "E-Scooter" | "E-Auto" | "E-Car";

const VEHICLE_FILTERS: VehicleFilter[] = [
  "All",
  "Cycle",
  "E-Scooter",
  "E-Auto",
  "E-Car",
];

const FALLBACK_PLANS: PricingPlan[] = [
  {
    name: "City Hopper",
    price: BigInt(49),
    features: [
      "Up to 5 rides/day",
      "City-wide coverage",
      "Real-time tracking",
      "In-app support",
    ],
  },
  {
    name: "Day Cruiser",
    price: BigInt(149),
    features: [
      "Unlimited rides/day",
      "Priority matching",
      "Dedicated rider pool",
      "24/7 support",
      "Ride history",
    ],
  },
  {
    name: "Monthly Pass",
    price: BigInt(999),
    features: [
      "Unlimited rides/month",
      "Premium riders only",
      "Schedule in advance",
      "Family sharing (2 accounts)",
      "Zero cancellation fees",
      "Analytics dashboard",
    ],
  },
];

const ESCOOTER_PLANS: PricingPlan[] = [
  {
    name: "Scoot Start",
    price: BigInt(39),
    features: [
      "Up to 5 rides/day",
      "E-Scooter rides only",
      "Real-time tracking",
      "In-app support",
    ],
  },
  {
    name: "Scoot Daily",
    price: BigInt(129),
    features: [
      "Unlimited rides/day",
      "Priority scooter matching",
      "Helmet assurance",
      "24/7 support",
      "Ride history",
    ],
  },
  {
    name: "Scoot Monthly",
    price: BigInt(799),
    features: [
      "Unlimited rides/month",
      "Premium scooters only",
      "Schedule in advance",
      "Family sharing (2 accounts)",
      "Zero cancellation fees",
      "Speed upgrade option",
    ],
  },
];

const EAUTO_PLANS: PricingPlan[] = [
  {
    name: "Auto Quick",
    price: BigInt(59),
    features: [
      "Up to 4 rides/day",
      "3-seater e-auto",
      "Real-time tracking",
      "In-app support",
    ],
  },
  {
    name: "Auto Daily",
    price: BigInt(179),
    features: [
      "Unlimited rides/day",
      "Priority auto matching",
      "AC e-auto available",
      "24/7 support",
      "Ride history",
    ],
  },
  {
    name: "Auto Monthly",
    price: BigInt(1199),
    features: [
      "Unlimited rides/month",
      "Premium auto pool",
      "Schedule in advance",
      "Family sharing (3 accounts)",
      "Zero cancellation fees",
      "Corporate billing",
    ],
  },
];

const ECAR_PLANS: PricingPlan[] = [
  {
    name: "Quick Ride",
    price: BigInt(79),
    features: [
      "Up to 3 rides/day",
      "Compact e-car",
      "Real-time tracking",
      "In-app support",
    ],
  },
  {
    name: "City Pass",
    price: BigInt(199),
    features: [
      "Unlimited rides/day",
      "Priority car matching",
      "Premium e-cars",
      "24/7 concierge support",
      "Ride history & receipts",
    ],
  },
  {
    name: "Monthly Elite",
    price: BigInt(1499),
    features: [
      "Unlimited rides/month",
      "Luxury e-cars only",
      "Schedule in advance",
      "Family sharing (4 accounts)",
      "Zero cancellation fees",
      "Corporate billing & GST",
    ],
  },
];

const PLANS_BY_VEHICLE: Record<VehicleFilter, PricingPlan[]> = {
  All: FALLBACK_PLANS,
  Cycle: FALLBACK_PLANS,
  "E-Scooter": ESCOOTER_PLANS,
  "E-Auto": EAUTO_PLANS,
  "E-Car": ECAR_PLANS,
};

const PLAN_BADGES = ["Starter", "Most Popular", "Best Value"];
const PLAN_HIGHLIGHTED = [false, true, false];

interface PricingSectionProps {
  onGetStarted: () => void;
}

export default function PricingSection({ onGetStarted }: PricingSectionProps) {
  const { data: plans, isLoading } = useGetPricingPlans();
  const [vehicleFilter, setVehicleFilter] = useState<VehicleFilter>("All");

  const basePlans =
    plans && plans.length > 0 && vehicleFilter === "All"
      ? plans
      : PLANS_BY_VEHICLE[vehicleFilter];
  const displayPlans = basePlans;

  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-secondary px-3 py-1 rounded-full mb-3">
            Affordable &amp; Green
          </span>
          <h2 className="font-heading font-bold text-4xl text-foreground mb-3">
            Pricing Plans
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Transparent pricing, no surge fees, no hidden charges. Just clean
            green rides.
          </p>
        </motion.div>

        {/* Vehicle Filter Pills */}
        <div
          className="flex justify-center gap-2 mb-10 flex-wrap"
          data-ocid="pricing.vehicle.select"
        >
          {VEHICLE_FILTERS.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setVehicleFilter(filter)}
              data-ocid={`pricing.vehicle.${filter.toLowerCase().replace("-", "")}.toggle`}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all ${
                vehicleFilter === filter
                  ? "bg-primary text-primary-foreground border-primary shadow-sm"
                  : "bg-secondary text-foreground border-border hover:border-primary/40"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div
            className="flex justify-center py-12"
            data-ocid="pricing.loading_state"
          >
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayPlans.slice(0, 3).map((plan, i) => {
              const highlighted = PLAN_HIGHLIGHTED[i % 3];
              return (
                <motion.div
                  key={`${vehicleFilter}-${plan.name}`}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  data-ocid={`pricing.item.${i + 1}`}
                  className={`relative rounded-2xl border p-6 flex flex-col gap-5 ${
                    highlighted
                      ? "border-primary shadow-card-hover bg-primary text-primary-foreground"
                      : "border-border shadow-card bg-white"
                  }`}
                >
                  {highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                        {PLAN_BADGES[i]}
                      </span>
                    </div>
                  )}
                  {!highlighted && (
                    <span className="self-start text-xs font-semibold bg-secondary text-primary px-2.5 py-0.5 rounded-full">
                      {PLAN_BADGES[i % 3]}
                    </span>
                  )}

                  <div>
                    <h3
                      className={`font-heading font-bold text-xl mb-1 ${highlighted ? "text-white" : "text-foreground"}`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-end gap-1">
                      <span
                        className={`font-heading font-extrabold text-4xl ${highlighted ? "text-white" : "text-primary"}`}
                      >
                        ₹{plan.price.toString()}
                      </span>
                      <span
                        className={`text-sm mb-1 ${highlighted ? "text-white/70" : "text-muted-foreground"}`}
                      >
                        /plan
                      </span>
                    </div>
                  </div>

                  <ul className="flex flex-col gap-2 flex-1">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Check
                          className={`w-4 h-4 mt-0.5 flex-shrink-0 ${highlighted ? "text-green-300" : "text-primary"}`}
                        />
                        <span
                          className={
                            highlighted
                              ? "text-white/90"
                              : "text-muted-foreground"
                          }
                        >
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={onGetStarted}
                    data-ocid={`pricing.get_started_button.${i + 1}`}
                    className={`w-full font-semibold ${
                      highlighted
                        ? "bg-white text-primary hover:bg-white/90"
                        : "bg-primary text-primary-foreground hover:bg-green-deep/90"
                    }`}
                  >
                    Get Started
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
