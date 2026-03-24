export function HeroMapSVG() {
  return (
    <svg
      viewBox="0 0 360 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Map showing available riders nearby"
      role="img"
    >
      <title>Available Riders Nearby Map</title>
      {/* Background */}
      <rect width="360" height="280" rx="12" fill="#F1F8F1" />

      {/* Grid lines */}
      {[40, 80, 120, 160, 200, 240].map((y) => (
        <line
          key={`h${y}`}
          x1="0"
          y1={y}
          x2="360"
          y2={y}
          stroke="#C8E6C9"
          strokeWidth="1"
        />
      ))}
      {[60, 120, 180, 240, 300].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="280"
          stroke="#C8E6C9"
          strokeWidth="1"
        />
      ))}

      {/* Roads */}
      <path
        d="M 0 140 Q 90 130 180 140 Q 270 150 360 140"
        stroke="#A5D6A7"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 180 0 Q 185 70 180 140 Q 175 210 180 280"
        stroke="#A5D6A7"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 0 200 Q 120 190 240 200"
        stroke="#C8E6C9"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 60 0 Q 65 90 60 140"
        stroke="#C8E6C9"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 300 140 Q 305 210 300 280"
        stroke="#C8E6C9"
        strokeWidth="5"
        fill="none"
        strokeLinecap="round"
      />

      {/* Route highlight */}
      <path
        d="M 60 200 Q 120 160 180 140 Q 240 120 300 100"
        stroke="#2E7D32"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeDasharray="8 4"
      />

      {/* Pickup marker */}
      <circle cx="60" cy="200" r="10" fill="#2E7D32" />
      <circle cx="60" cy="200" r="5" fill="white" />
      <circle cx="60" cy="200" r="18" fill="#2E7D32" fillOpacity="0.15" />

      {/* Destination marker */}
      <path d="M300 100 L300 115" stroke="#E53935" strokeWidth="2.5" />
      <circle cx="300" cy="90" r="10" fill="#E53935" />
      <circle cx="300" cy="90" r="4" fill="white" />

      {/* Rider 1 */}
      <circle cx="120" cy="155" r="8" fill="#43A047" />
      <text
        x="120"
        y="159"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        R
      </text>
      <rect
        x="130"
        y="148"
        width="40"
        height="14"
        rx="7"
        fill="white"
        stroke="#43A047"
        strokeWidth="1"
      />
      <text
        x="150"
        y="158"
        textAnchor="middle"
        fill="#2E7D32"
        fontSize="7"
        fontWeight="600"
      >
        0.3 km
      </text>

      {/* Rider 2 */}
      <circle cx="200" cy="125" r="8" fill="#43A047" />
      <text
        x="200"
        y="129"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        R
      </text>
      <rect
        x="210"
        y="118"
        width="40"
        height="14"
        rx="7"
        fill="white"
        stroke="#43A047"
        strokeWidth="1"
      />
      <text
        x="230"
        y="128"
        textAnchor="middle"
        fill="#2E7D32"
        fontSize="7"
        fontWeight="600"
      >
        0.8 km
      </text>

      {/* Rider 3 */}
      <circle cx="80" cy="130" r="8" fill="#66BB6A" />
      <text
        x="80"
        y="134"
        textAnchor="middle"
        fill="white"
        fontSize="8"
        fontWeight="bold"
      >
        R
      </text>
      <rect
        x="90"
        y="123"
        width="40"
        height="14"
        rx="7"
        fill="white"
        stroke="#66BB6A"
        strokeWidth="1"
      />
      <text
        x="110"
        y="133"
        textAnchor="middle"
        fill="#2E7D32"
        fontSize="7"
        fontWeight="600"
      >
        1.2 km
      </text>

      {/* Legend */}
      <rect
        x="10"
        y="250"
        width="100"
        height="22"
        rx="4"
        fill="white"
        fillOpacity="0.9"
      />
      <circle cx="22" cy="261" r="5" fill="#2E7D32" />
      <text x="30" y="265" fill="#1F1F1F" fontSize="8" fontWeight="500">
        5 riders nearby
      </text>
    </svg>
  );
}

export function LiveTrackSVG() {
  return (
    <svg
      viewBox="0 0 400 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Live ride tracking map"
      role="img"
    >
      <title>Live Ride Tracking</title>
      <rect width="400" height="220" rx="8" fill="#F9FBF9" />
      {[40, 80, 120, 160, 200].map((y) => (
        <line
          key={`h${y}`}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          stroke="#E8F5E9"
          strokeWidth="1"
        />
      ))}
      {[80, 160, 240, 320].map((x) => (
        <line
          key={`v${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="220"
          stroke="#E8F5E9"
          strokeWidth="1"
        />
      ))}
      <path
        d="M 50 170 Q 150 160 200 120 Q 250 80 340 60"
        stroke="#C8E6C9"
        strokeWidth="10"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M 50 170 Q 150 160 200 120 Q 250 80 340 60"
        stroke="#2E7D32"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Moving bike */}
      <circle cx="185" cy="124" r="14" fill="#2E7D32" fillOpacity="0.15" />
      <circle cx="185" cy="124" r="9" fill="#2E7D32" />
      <text x="185" y="128" textAnchor="middle" fill="white" fontSize="9">
        🚴
      </text>

      {/* Start */}
      <circle cx="50" cy="170" r="7" fill="#43A047" />
      <circle cx="50" cy="170" r="3" fill="white" />
      <text x="50" y="188" textAnchor="middle" fill="#616161" fontSize="9">
        Start
      </text>

      {/* End */}
      <path d="M340 60 L340 75" stroke="#E53935" strokeWidth="2" />
      <circle cx="340" cy="52" r="8" fill="#E53935" />
      <circle cx="340" cy="52" r="3" fill="white" />
      <text x="340" y="90" textAnchor="middle" fill="#616161" fontSize="9">
        Dest.
      </text>

      {/* ETA badge */}
      <rect x="155" y="88" width="60" height="22" rx="11" fill="#2E7D32" />
      <text
        x="185"
        y="103"
        textAnchor="middle"
        fill="white"
        fontSize="9"
        fontWeight="600"
      >
        ETA 4 min
      </text>

      {/* Distance */}
      <rect
        x="270"
        y="50"
        width="55"
        height="18"
        rx="9"
        fill="white"
        stroke="#C8E6C9"
        strokeWidth="1"
      />
      <text
        x="297"
        y="63"
        textAnchor="middle"
        fill="#2E7D32"
        fontSize="8"
        fontWeight="600"
      >
        2.4 km left
      </text>
    </svg>
  );
}
