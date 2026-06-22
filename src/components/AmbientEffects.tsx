import React, { useEffect, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  type: "lavender" | "sparkle" | "blossom" | "leaf" | "heart";
  delay: number;
  duration: number;
}

interface AmbientEffectsProps {
  theme: "royal-lavender" | "midnight-lavender" | "classic-orchid";
}

export default function AmbientEffects({ theme }: AmbientEffectsProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Spawn a select set of floating items
    const types: Particle["type"][] = ["lavender", "sparkle", "blossom", "leaf", "heart"];
    
    const initialParticles: Particle[] = Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // percentage from left
      y: 100 + Math.random() * 20, // start below viewport
      size: theme === "royal-lavender" ? 16 + Math.random() * 18 : 12 + Math.random() * 14,
      type: types[i % types.length],
      delay: Math.random() * 12,
      duration: 16 + Math.random() * 18,
    }));

    setParticles(initialParticles);

    // Dynamic spawning loop occasionally to maintain ambience
    const interval = setInterval(() => {
      setParticles((prev) => {
        // Recycle offscreen particles
        return prev.map((p) => {
          const element = document.getElementById(`particle-${p.id}`);
          if (element) {
            const rect = element.getBoundingClientRect();
            // If it has floated out of view (top < -50px), reset to bottom
            if (rect.bottom < 0) {
              return {
                ...p,
                x: Math.random() * 100,
                y: 100 + Math.random() * 10,
                delay: 0,
              };
            }
          }
          return p;
        });
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [theme]);

  const getEmoji = (type: Particle["type"]) => {
    switch (type) {
      case "lavender":
        return "🪻";
      case "blossom":
        return "🌸";
      case "leaf":
        return "🌿";
      case "sparkle":
        return "✨";
      case "heart":
        return "💜";
      default:
        return "✨";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-20 select-none">
      {/* Floating sparkles and hearts */}
      {particles.map((p) => (
        <span
          key={p.id}
          id={`particle-${p.id}`}
          className="absolute opacity-60 filter drop-shadow animate-float select-none pointer-events-none text-purple-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: `${p.size}px`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            filter: theme === "midnight-lavender" 
              ? "drop-shadow(0 0 6px rgba(189, 147, 249, 0.7))" 
              : "drop-shadow(0 0 3px rgba(167, 139, 250, 0.3))"
          }}
        >
          {getEmoji(p.type)}
        </span>
      ))}

      {/* Glittering dust overlay */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "radial-gradient(ellipse at 50% 50%, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0) 80%)",
        }}
      />
    </div>
  );
}
