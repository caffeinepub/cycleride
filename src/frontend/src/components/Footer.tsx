import { Bike, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";
  const caffeineUrl = `https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`;

  const links = {
    Links: [
      { label: "Home", href: "/" },
      { label: "Services", href: "#services" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Safety", href: "#safety" },
    ],
    Support: [
      { label: "Help Center", href: "/" },
      { label: "Contact Us", href: "/" },
      { label: "Track Ride", href: "/" },
      { label: "Report Issue", href: "/" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "/" },
      { label: "Terms of Service", href: "/" },
      { label: "Cookie Policy", href: "/" },
      { label: "Refund Policy", href: "/" },
    ],
  };

  const socials = [
    { Icon: Instagram, label: "Instagram", href: "https://instagram.com" },
    { Icon: Twitter, label: "Twitter", href: "https://twitter.com" },
    { Icon: Facebook, label: "Facebook", href: "https://facebook.com" },
    { Icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-footer-bg text-footer-text">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Bike className="w-5 h-5 text-white" />
              </div>
              <span className="font-heading font-bold text-xl text-white">
                Cycle<span className="text-green-400">RIDE</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed opacity-70 max-w-xs">
              Eco-friendly cycle rides for every urban journey. Connecting
              communities, one pedal at a time.
            </p>
            <div className="flex gap-3 mt-5">
              {socials.map(({ Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h4 className="font-heading font-semibold text-white text-sm mb-4">
                {title}
              </h4>
              <ul className="flex flex-col gap-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm opacity-60 hover:opacity-100 hover:text-green-400 transition-all"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
          <p>© {year} CycleRIDE. All rights reserved.</p>
          <p>
            Built with ❤️ using{" "}
            <a
              href={caffeineUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-100 underline underline-offset-2"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
