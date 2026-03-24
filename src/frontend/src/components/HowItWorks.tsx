import { Bike, Smartphone, Star, UserCheck } from "lucide-react";
import { motion } from "motion/react";

const steps = [
  {
    icon: Smartphone,
    step: "01",
    title: "Request a Ride",
    description:
      "Enter your pickup and drop-off location. Choose your preferred ride type.",
    color: "bg-secondary text-primary",
  },
  {
    icon: UserCheck,
    step: "02",
    title: "Match with Rider",
    description:
      "Our algorithm instantly connects you with the nearest available cyclist.",
    color: "bg-secondary text-primary",
  },
  {
    icon: Bike,
    step: "03",
    title: "Enjoy Your Ride",
    description:
      "Track your rider live on the map. Sit back and enjoy the eco-friendly journey.",
    color: "bg-secondary text-primary",
  },
  {
    icon: Star,
    step: "04",
    title: "Rate & Review",
    description:
      "Share your experience to help build a trustworthy rider community.",
    color: "bg-secondary text-primary",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-secondary/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-primary bg-secondary px-3 py-1 rounded-full mb-3">
            Simple &amp; Fast
          </span>
          <h2 className="font-heading font-bold text-4xl text-foreground mb-3">
            How It Works
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From request to destination in 4 simple steps.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                data-ocid={`how_it_works.item.${i + 1}`}
                className="relative bg-white rounded-2xl border border-border p-6 shadow-card hover:shadow-card-hover transition-shadow"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-heading font-extrabold text-3xl text-primary/20">
                    {step.step}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-base text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
