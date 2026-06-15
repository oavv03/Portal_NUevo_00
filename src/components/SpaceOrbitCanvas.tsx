import React, { useEffect, useRef } from "react";

/**
 * High-performance, lightweight, responsive interactive 3D Cosmic canvas.
 * Draws a rotating 3D wireframe icosahedron core, an inner octahedron,
 * and an orbital rings swarm of 200+ micro-particles that sway dynamically
 * based on mouse parallax coordinates.
 */
export const SpaceOrbitCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse interactive coordinates with smooth inertia
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const handleMouseMove = (e: MouseEvent) => {
      const windowHalfX = window.innerWidth / 2;
      const windowHalfY = window.innerHeight / 2;
      mouse.targetX = (e.clientX - windowHalfX) * 0.25;
      mouse.targetY = (e.clientY - windowHalfY) * 0.25;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const windowHalfX = window.innerWidth / 2;
        const windowHalfY = window.innerHeight / 2;
        mouse.targetX = (e.touches[0].clientX - windowHalfX) * 0.35;
        mouse.targetY = (e.touches[0].clientY - windowHalfY) * 0.35;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Handle container resize
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        width = canvas.width = entry.contentRect.width || window.innerWidth;
        height = canvas.height = entry.contentRect.height || window.innerHeight;
      }
    });

    resizeObserver.observe(document.body);

    // --- 3D MATH & GEOMETRY DATA ---

    // Golden ratio for Icosahedron
    const phi = (1 + Math.sqrt(5)) / 2;
    // 12 vertices of Icosahedron
    const icosahedronVertices: Array<[number, number, number]> = [
      [-1, phi, 0],
      [1, phi, 0],
      [-1, -phi, 0],
      [1, -phi, 0],
      [0, -1, phi],
      [0, 1, phi],
      [0, -1, -phi],
      [0, 1, -phi],
      [phi, 0, -1],
      [phi, 0, 1],
      [-phi, 0, -1],
      [-phi, 0, 1],
    ].map(([x, y, z]) => {
      // Scale up geometry
      const scale = 36;
      return [x * scale, y * scale, z * scale];
    });

    // 30 unique edges of an icosahedron (indices of vertices that are connected)
    const icosahedronEdges: Array<[number, number]> = [];
    for (let i = 0; i < 12; i++) {
      for (let j = i + 1; j < 12; j++) {
        const dx = icosahedronVertices[i][0] - icosahedronVertices[j][0];
        const dy = icosahedronVertices[i][1] - icosahedronVertices[j][1];
        const dz = icosahedronVertices[i][2] - icosahedronVertices[j][2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        // Distance check to find connected adjacent neighbors in normalized coordinates
        if (dist < 70) {
          icosahedronEdges.push([i, j]);
        }
      }
    }

    // Octahedron vertices for the emerald inner core
    const octahedronVertices: Array<[number, number, number]> = [
      [0, 20, 0],   // Top
      [0, -20, 0],  // Bottom
      [20, 0, 0],   // Right
      [-20, 0, 0],  // Left
      [0, 0, 20],   // Front
      [0, 0, -20],  // Back
    ];

    const octahedronEdges: Array<[number, number]> = [
      [0, 2], [0, 3], [0, 4], [0, 5], // Top pyrimid
      [1, 2], [1, 3], [1, 4], [1, 5], // Bottom pyrimid
      [2, 4], [4, 3], [3, 5], [5, 2], // Middle belt
    ];

    // Orbital dust ring particles (250 cosmic particles)
    interface Particle {
      angle: number;
      radius: number;
      speed: number;
      yMult: number; // For tilted isometric-style orbits
      size: number;
      color: string;
      phaseShift: number;
    }

    const particles: Particle[] = [];
    const colorSchemes = [
      "rgba(14, 165, 233, ",  // Cyan-500
      "rgba(16, 185, 129, ",  // Emerald-500
      "rgba(99, 102, 241, ",  // Indigo-500
      "rgba(20, 184, 166, ",  // Teal-500
    ];

    for (let i = 0; i < 240; i++) {
      // Choose ring layer
      const ringType = Math.random();
      let radius = 100 + Math.random() * 120;
      let yMult = 0.35 + Math.random() * 0.15; // Ellipse squash factor

      if (ringType > 0.7) {
        radius = 50 + Math.random() * 50; // Inner disk
        yMult = 0.5;
      } else if (ringType > 0.9) {
        radius = 220 + Math.random() * 80; // Outer halo
        yMult = 0.25;
      }

      particles.push({
        angle: Math.random() * Math.PI * 2,
        radius: radius,
        speed: (0.002 + Math.random() * 0.005) * (Math.random() > 0.5 ? 1 : -1),
        yMult: yMult,
        size: 0.8 + Math.random() * 2.2,
        color: colorSchemes[Math.floor(Math.random() * colorSchemes.length)],
        phaseShift: Math.random() * Math.PI * 2,
      });
    }

    // 3D rotation angles
    let angleX = 0.004;
    let angleY = 0.006;
    let angleZ = 0.002;

    // Projection factors
    const fov = 350;

    // Draw loop
    const render = () => {
      // Clear canvas with deep dark void and gentle alpha trails
      ctx.fillStyle = "rgba(3, 0, 10, 0.16)";
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // Centers for projection (adjust to the mouse interactive displacement)
      const cx = width / 2 + mouse.x;
      const cy = height / 2 + mouse.y;

      // Rotate angles incrementally
      angleY += 0.004;
      angleX += 0.002;
      angleZ += 0.001;

      // Rotary matrix helpers for current state
      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // Project and draw particles
      particles.forEach((p) => {
        // Orbit update
        p.angle += p.speed;

        // Base 3D orbit around Y-axis, then slightly tilted
        let px = p.radius * Math.cos(p.angle);
        let pz = p.radius * Math.sin(p.angle);
        let py = p.radius * p.yMult * Math.sin(p.angle + p.phaseShift) * 0.1; // Squeezed Y wave

        // Apply mouse inertia tilt
        const tiltX = mouse.y * 0.003;
        const tiltY = mouse.x * 0.003;

        // Apply basic rotations for tilt interaction
        const cosTX = Math.cos(tiltX);
        const sinTX = Math.sin(tiltX);
        const cosTY = Math.cos(tiltY);
        const sinTY = Math.sin(tiltY);

        // Tilt logic
        let y1 = py * cosTX - pz * sinTX;
        let z1 = py * sinTX + pz * cosTX;
        let x2 = px * cosTY + z1 * sinTY;
        let z2 = -px * sinTY + z1 * cosTY;

        // Perspective scaling
        const factor = fov / (fov + z2);
        const screenX = cx + x2 * factor;
        const screenY = cy + y1 * factor;

        // Only draw if within reasonable bounds
        if (screenX >= 0 && screenX <= width && screenY >= 0 && screenY <= height) {
          // Dynamic alpha based on Z index (simulate depth fogging)
          const zDepthClamped = Math.max(0.1, Math.min(1.0, (z2 + 250) / 500));
          const opacity = (1.1 - zDepthClamped) * 0.8;

          ctx.beginPath();
          ctx.arc(screenX, screenY, p.size * factor, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${opacity.toFixed(2)})`;
          ctx.shadowBlur = p.size * 3;
          ctx.shadowColor = p.color === colorSchemes[0] ? "#0ea5e9" : "#10b981";
          ctx.fill();
        }
      });

      // helper for 3D rotation of vertices
      const rotate3D = (x: number, y: number, z: number): [number, number, number] => {
        // Rotate Z
        let x1 = x * cosZ - y * sinZ;
        let y1 = x * sinZ + y * cosZ;
        let z1 = z;

        // Rotate Y
        let x2 = x1 * cosY + z1 * sinY;
        let y2 = y1;
        let z2 = -x1 * sinY + z1 * cosY;

        // Rotate X
        let x3 = x2;
        let y3 = y2 * cosX - z2 * sinX;
        let z3 = y2 * sinX + z2 * cosX;

        return [x3, y3, z3];
      };

      // Resets shadow settings for solid vectors
      ctx.shadowBlur = 0;

      // 1. Draw Inner Octahedron Core (Emerald Green)
      const projectedOcta: Array<[number, number, number]> = [];
      octahedronVertices.forEach(([x, y, z]) => {
        const [rx, ry, rz] = rotate3D(x * 1.1, y * 1.1, z * 1.1);
        const factor = fov / (fov + rz);
        projectedOcta.push([cx + rx * factor, cy + ry * factor, rz]);
      });

      // Octahedron Edges
      ctx.strokeStyle = "rgba(16, 185, 129, 0.45)"; // Emerald-500
      ctx.lineWidth = 1.0;
      octahedronEdges.forEach(([startIdx, endIdx]) => {
        const start = projectedOcta[startIdx];
        const end = projectedOcta[endIdx];

        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });

      // 2. Draw Outer Icosahedron Core (Celestial Sky Blue)
      const projectedIcosa: Array<[number, number, number]> = [];
      icosahedronVertices.forEach(([x, y, z]) => {
        const [rx, ry, rz] = rotate3D(x, y, z);
        const factor = fov / (fov + rz);
        projectedIcosa.push([cx + rx * factor, cy + ry * factor, rz]);
      });

      // Icosahedron Edges with backface tint shading
      icosahedronEdges.forEach(([startIdx, endIdx]) => {
        const start = projectedIcosa[startIdx];
        const end = projectedIcosa[endIdx];

        // Draw with fading gradient based on depth (z-coordinate)
        const avgZ = (start[2] + end[2]) / 2;
        const opacity = Math.max(0.08, Math.min(0.65, 1.0 - (avgZ + 60) / 120));

        ctx.strokeStyle = `rgba(14, 165, 233, ${opacity.toFixed(3)})`; // Sky Blue 0ea5e9
        ctx.lineWidth = 1.5;

        // Add subtle neon glow effect on front lines
        if (avgZ < 0) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = "#0ea5e9";
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.beginPath();
        ctx.moveTo(start[0], start[1]);
        ctx.lineTo(end[0], end[1]);
        ctx.stroke();
      });

      // Draw vertex connection points
      ctx.shadowBlur = 0;
      projectedIcosa.forEach(([vx, vy, vz]) => {
        if (vz < 20) {
          ctx.beginPath();
          ctx.arc(vx, vy, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = "#38bdf8"; // Light Sky Blue 
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full block pointer-events-none z-0"
      id="canvas3d"
    />
  );
};
