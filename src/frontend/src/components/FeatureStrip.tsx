import { Clock, CreditCard, Headphones, Leaf, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

const features = [
  { icon: Leaf, label: "Zero Emissions" },
  { icon: Shield, label: "Safety Verified" },
  { icon: Zap, label: "Instant Matching" },
  { icon: Clock, label: "24/7 Available" },
  { icon: CreditCard, label: "Easy Payment" },
  { icon: Headphones, label: "Live Support" },
];

export default function FeatureStrip() {
  return (
    <section id="safety" className="py-10 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-white text-xs font-semibold">
                  {feature.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
