"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// @ts-ignore — three-globe has no default types
import ThreeGlobe from "three-globe";

// Full-screen, animated GitHub-style globe component for Next.js App Router (15+)
// Drop this file anywhere (e.g., src/app/globe/page.tsx) — it exports a page component.
// npm i three three-globe

export default function GlobePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="relative h-[70vh] md:h-[78vh] lg:h-[82vh]">
        <GlobeCanvas />
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <p className="text-xs md:text-sm opacity-70 bg-black/40 rounded-full px-3 py-1 backdrop-blur">
            Drag to orbit • Scroll to zoom • Inertia on
          </p>
        </div>
      </div>
    </div>
  );
}

function GlobeCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene & camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 2000);
    camera.position.set(0, 120, 360);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(200, 200, 200);
    scene.add(dirLight);

    // Globe
    const globe = new (ThreeGlobe as any)()
      .globeImageUrl(
        // You can mirror this asset into /public for production stability
        "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
      )
      .bumpImageUrl("https://unpkg.com/three-globe/example/img/earth-topology.png")
      .showAtmosphere(true)
      .atmosphereAltitude(0.22)
      .atmosphereColor("#61dafb");

    // Add a subtle glow sphere (inside-out)
    const glowGeom = new THREE.SphereGeometry(100, 64, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color("#61dafb"),
      transparent: true,
      opacity: 0.08,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowMesh = new THREE.Mesh(glowGeom, glowMat);
    glowMesh.scale.setScalar(1.35);

    // Stars background
    const starsGeom = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const r = 1200; // distance
      const theta = Math.acos(THREE.MathUtils.randFloatSpread(2));
      const phi = THREE.MathUtils.randFloat(0, 2 * Math.PI);
      positions[i * 3] = r * Math.sin(theta) * Math.cos(phi);
      positions[i * 3 + 1] = r * Math.cos(theta);
      positions[i * 3 + 2] = r * Math.sin(theta) * Math.sin(phi);
    }
    starsGeom.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starsGeom,
      new THREE.PointsMaterial({ size: 1.1, sizeAttenuation: true })
    );

    // Sample arcs (like GitHub globe connections)
    const arcs = sampleArcs();
    globe
      .arcsData(arcs)
      .arcColor((d: any) => d.color)
      .arcAltitude((d: any) => d.altitude)
      .arcStroke((d: any) => d.stroke)
      .arcDashLength(0.35)
      .arcDashGap(0.7)
      .arcDashInitialGap((d: any) => Math.random())
      .arcDashAnimateTime((d: any) => 1200 + Math.random() * 2200);

    // Points / locations
    const points = arcs.flatMap((a) => [
      { lat: a.startLat, lng: a.startLng, size: 0.6, color: "#ffffff" },
      { lat: a.endLat, lng: a.endLng, size: 0.6, color: "#ffffff" },
    ]);
    globe
      .pointsData(points)
      .pointAltitude((d: any) => 0.02 + d.size * 0.01)
      .pointColor((d: any) => d.color)
      .pointRadius(0.3);

    const globeObj = globe as unknown as THREE.Object3D;
    globeObj.scale.setScalar(1.05);

    scene.add(globeObj);
    scene.add(glowMesh);
    scene.add(stars);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.rotateSpeed = 0.45;
    controls.minDistance = 160;
    controls.maxDistance = 550;

    // Slow auto-rotation w/ pause on user interaction
    let autoRotate = true;
    let lastInteraction = Date.now();
    const interact = () => {
      lastInteraction = Date.now();
      autoRotate = false;
    };
    ["mousedown", "wheel", "touchstart", "pointerdown"].forEach((e) => {
      renderer.domElement.addEventListener(e, interact, { passive: true });
    });

    // Resize
    const resize = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      renderer.setSize(clientWidth, clientHeight);
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(containerRef.current);

    // Animate
    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const now = Date.now();
      if (!autoRotate && now - lastInteraction > 2400) autoRotate = true;
      if (autoRotate) globeObj.rotation.y += 0.0016; // gentle spin
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      ["mousedown", "wheel", "touchstart", "pointerdown"].forEach((e) => {
        renderer.domElement.removeEventListener(e, interact as any);
      });
      controls.dispose();
      starsGeom.dispose();
      glowGeom.dispose();
      glowMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="absolute inset-0" />;
}

// Simple synthetic routes between major hubs
function sampleArcs() {
  const hubs = [
    { city: "San Francisco", lat: 37.7749, lng: -122.4194 },
    { city: "New York", lat: 40.7128, lng: -74.006 },
    { city: "London", lat: 51.5074, lng: -0.1278 },
    { city: "Berlin", lat: 52.52, lng: 13.405 },
    { city: "Tokyo", lat: 35.6895, lng: 139.6917 },
    { city: "Sydney", lat: -33.8688, lng: 151.2093 },
    { city: "Singapore", lat: 1.3521, lng: 103.8198 },
    { city: "São Paulo", lat: -23.5505, lng: -46.6333 },
    { city: "Johannesburg", lat: -26.2041, lng: 28.0473 },
    { city: "Auckland", lat: -36.8485, lng: 174.7633 },
  ];

  const pick = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];
  const colors = ["#22d3ee", "#7dd3fc", "#60a5fa", "#a78bfa"];

  const arcs = Array.from({ length: 40 }, () => {
    const a = pick(hubs);
    let b = pick(hubs);
    while (b === a) b = pick(hubs);
    return {
      startLat: a.lat,
      startLng: a.lng,
      endLat: b.lat,
      endLng: b.lng,
      color: pick(colors),
      altitude: 0.08 + Math.random() * 0.22,
      stroke: 0.6 + Math.random() * 0.6,
    };
  });

  return arcs;
}
