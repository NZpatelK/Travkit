"use client";

import React from "react";
import { motion, useAnimation } from "framer-motion";

type PlaneLoaderProps = {
  size?: number; // base width in px (responsive max)
  duration?: number; // seconds for one left->right pass
};

export default function PlaneLoader({ size = 220, duration = 4 }: PlaneLoaderProps) {
  const controls = useAnimation();

  React.useEffect(() => {
    // start a looping animation (framer-motion handles loop naturally)
    controls.start({ x: ["-110%", "110%"], rotate: [ -6, 6, -6 ], transition: { duration, ease: "linear", repeat: Infinity } });
  }, [controls, duration]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-transparent pointer-events-none">
      <div className="flex flex-col items-center justify-center pointer-events-auto" style={{ width: size }}>
        <div className="relative w-full h-36 md:h-44">
          {/* motion wrapper moves the plane along a horizontal track and adds a tilt animation */}
          <motion.div
            animate={controls}
            initial={{ x: "-110%", y: 0 }}
            style={{ position: "absolute", top: "50%", left: "0%", translateY: "-50%" }}
          >
            <div className="flex items-center space-x-3">
              {/* Soft shadow under plane */}
              <div className="relative">
                <svg
                  viewBox="0 0 300 100"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden
                  role="img"
                  className="block w-full max-w-[220px] h-auto"
                >
                  {/* Plane silhouette (A380-inspired, simplified) */}
                  <g transform="translate(0,10) scale(0.9)">
                    <path d="M10 50 C40 45 80 42 120 42 C140 42 160 45 190 50 C200 52 220 55 240 55 C250 55 270 52 285 48 L290 46 L295 46 L294 44 C290 36 270 30 250 28 C240 27 220 26 210 24 C195 21 180 18 160 18 C140 18 120 20 100 26 C70 36 40 48 10 50 Z" fill="#E6EEF8" />
                    {/* windows row */}
                    <g fill="#0F172A" opacity="0.6">
                      {Array.from({ length: 12 }).map((_, i) => (
                        <rect key={i} x={70 + i * 10} y={30} width={4} height={3} rx={1} />
                      ))}
                    </g>
                    {/* cockpit */}
                    <path d="M8 46 C18 40 34 36 48 36 L56 36 C50 40 30 50 8 50 Z" fill="#CDE6FF" opacity="0.9" />
                    {/* engines (double-deck feel) */}
                    <g transform="translate(120,40)">
                      <ellipse cx="12" cy="8" rx="12" ry="6" fill="#B0CFE6" />
                      <ellipse cx="38" cy="8" rx="12" ry="6" fill="#B0CFE6" />
                    </g>
                  </g>
                </svg>

                {/* subtle blurred shadow under plane */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-12px] w-40 h-6 rounded-full opacity-40 filter blur-sm" style={{ background: "radial-gradient(ellipse at center, rgba(3,7,18,0.35), rgba(3,7,18,0.05))" }} />
              </div>
            </div>
          </motion.div>

          {/* subtle path guide (decorative) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 40" preserveAspectRatio="none">
            <path d="M0 26 C25 8, 75 8, 100 26" stroke="#CBD5E1" strokeWidth="0.3" fill="none" strokeDasharray="2 2" opacity="0.8" />
          </svg>
        </div>

        {/* loading text below plane */}
        <div className="mt-4 text-center">
          <div className="text-xs md:text-sm text-slate-500">Loading — Preparing flight</div>
        </div>
      </div>
    </div>
  );
}

