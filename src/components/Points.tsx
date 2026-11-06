"use client";
import { Plus } from "lucide-react";
import "@/app/globals.css";
import React, { useEffect, useRef, useState } from "react";

const AnimatedCounter = ({ target, duration = 2000 }: { target: number; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) {
              requestAnimationFrame(animate);
            }
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return (
    <div ref={ref} className="odemeter sub__title">
      <p>{count}</p>
    </div>
  );
};

const stats = [
  { id: "experience", target: 5, label: "Years Of Experience" },
  { id: "project", target: 50, label: "Completed Projects" },
  { id: "awards", target: 15, label: "Awards & Certifications" },
  { id: "clients", target: 30, label: "Clients Worldwide" },
];

const Points = () => {
  return (
    <>
      <div className="points">
        {stats.map((stat) => (
          <div className="point" key={stat.id}>
            <div className="flex">
              <AnimatedCounter target={stat.target} />
              <h3 className="sub__title">
                <Plus size={20} />
              </h3>
            </div>
            <p className="text__muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default Points;
