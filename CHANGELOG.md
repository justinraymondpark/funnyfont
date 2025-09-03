# Changelog

## 1.1.1 - CURSOR INTERACTION FIXES 🔧
- Fixed mouse position tracking and coordinate conversion
- Improved character positioning calculation for accurate distances
- Added smoothstep falloff curves for smoother interactions
- Enhanced attract/repel responsiveness with better strength values
- Added debug cursor radius indicator
- Fixed jittery behavior with improved smoothing

## 1.1.0 - CURSOR INTERACTIONS 🎯
- Real-time cursor interaction system with 5 modes:
  - 🧲 Attract: Characters pull toward cursor with scaling
  - 💥 Repel: Characters push away with blur effects  
  - 🌊 Distort: Warping and skewing based on distance
  - 🌪️ Vortex: Spiral motion around cursor
  - 🌍 Gravity: Gravitational pull with opacity fade
- Customizable strength, radius, and smoothing controls
- Mouse position tracking in SVG coordinate space
- Dynamic character-to-cursor distance calculations

## 1.0.0 - MAJOR ANIMATION OVERHAUL 🚀
- Complete redesign of motion system with advanced physics
- Multi-dimensional transforms: dx/dy, scale, rotation, skew, blur
- 11 sophisticated presets: Vortex, Gravity, Magnetism, Fluid Dynamics, Quantum Flicker, Dimensional Rift, Psychedelic, Glitch Matrix, Organic Pulse, Cosmic Dance, Neural Network
- Advanced easing curves: bounce, elastic, back
- Complexity and chaos controls for layered effects
- Turbulent noise and particle behaviors
- Time-based organic motion patterns

## 0.3.0
- Upgrade motion engine: dx/dy/opacity, lightweight noise
- New presets: liquid, orbit, swirl, shimmer
- Expanded curated variable fonts list

## 0.2.1
- Expand motion presets: breathe, bounce, elastic, ripple, cascade, type-on
- Per-character opacity for cascade and type-on

## 0.2.0
- Add motion system with presets (wave, drift, jitter)
- Per-character SVG tspans with rAF-driven loop
- Motion controls: preset, amplitude, frequency, stagger, curve, loop duration

## 0.1.1
- Replace webfontloader with safe stylesheet injection to fix Netlify runtime error
- Remove webfontloader dependency

## 0.1.0
- Scaffold React + Vite + TS app
- Add Tailwind, Zustand, Framer Motion deps
- Create SVG preview with variable font axes and gradient editor
- Add PNG/SVG export panel
- Netlify config for SPA


