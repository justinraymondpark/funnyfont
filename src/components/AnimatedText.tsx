import { useEffect, useMemo, useRef } from 'react';
import { useProjectStore } from '../state/useProjectStore';

type Props = React.SVGProps<SVGTextElement> & { text: string; mousePos: { x: number; y: number } };

export function AnimatedText({ text, mousePos, ...rest }: Props) {
	const { motion, cursor } = useProjectStore();
	const groupRef = useRef<SVGGElement>(null);
	const chars = useMemo(() => text.split(''), [text]);

	useEffect(() => {
		let rafId = 0;
		const start = performance.now();

		const loop = () => {
			const now = performance.now();
			const t = ((now - start) / 1000) % motion.loopSeconds;
			const phase = (t / motion.loopSeconds) * Math.PI * 2;

			const g = groupRef.current;
			if (g) {
				for (let i = 0; i < g.children.length; i++) {
					const span = g.children[i] as SVGTextElement;
					const offset = i * motion.stagger;
					
					// Calculate more accurate character position for cursor interaction
					const textElement = g.querySelector('text');
					const charX = (rest.x || 0) as number;
					const charY = (rest.y || 0) as number;
					
					// Get actual character spacing based on font size
					const fontSize = textElement ? 
						parseInt(getComputedStyle(textElement).fontSize) || 120 : 120;
					const charSpacing = fontSize * 0.6; // More accurate spacing estimate
					
					// Calculate position based on text anchor
					const textAnchor = textElement?.getAttribute('text-anchor') || 'middle';
					let actualCharX = charX;
					
					if (textAnchor === 'middle') {
						actualCharX = charX + (i - (g.children.length - 1) / 2) * charSpacing;
					} else if (textAnchor === 'start') {
						actualCharX = charX + i * charSpacing;
					} else if (textAnchor === 'end') {
						actualCharX = charX - (g.children.length - 1 - i) * charSpacing;
					}
					
					const actualCharY = charY;
					
					const res = evaluateAdvancedPreset(motion.preset, phase + offset, motion, i, g.children.length, t);
					
					// Apply cursor interaction
					const cursorEffect = evaluateCursorInteraction(cursor, mousePos, actualCharX, actualCharY, t);
					
					// Combine motion and cursor effects
					const finalDx = res.dx + cursorEffect.dx;
					const finalDy = res.dy + cursorEffect.dy;
					const finalScale = res.scale * cursorEffect.scale;
					const finalRotation = res.rotation + cursorEffect.rotation;
					const finalOpacity = res.opacity * cursorEffect.opacity;
					const finalBlur = res.blur + cursorEffect.blur;
					
					// Apply multi-dimensional transforms
					const transforms = [];
					if (finalDx !== 0 || finalDy !== 0) transforms.push(`translate(${finalDx.toFixed(2)} ${finalDy.toFixed(2)})`);
					if (finalScale !== 1) transforms.push(`scale(${finalScale.toFixed(3)})`);
					if (finalRotation !== 0) transforms.push(`rotate(${finalRotation.toFixed(2)})`);
					if (res.skewX !== 0) transforms.push(`skewX(${res.skewX.toFixed(2)})`);
					
					span.setAttribute('transform', transforms.join(' '));
					span.setAttribute('opacity', finalOpacity.toFixed(3));
					
					// Advanced filter effects
					if (finalBlur > 0) {
						span.setAttribute('filter', `blur(${finalBlur.toFixed(1)}px)`);
					} else {
						span.removeAttribute('filter');
					}
				}
			}
			rAF();
		};

		function rAF() {
			rafId = requestAnimationFrame(loop);
		}

		rAF();
		return () => cancelAnimationFrame(rafId);
	}, [motion.preset, motion.amplitude, motion.frequency, motion.stagger, motion.curve, motion.loopSeconds, motion.complexity, motion.chaos, cursor.mode, cursor.strength, cursor.radius, cursor.smoothing, mousePos]);

	return (
		<g ref={groupRef}>
			<text {...rest}>
				{chars.map((ch, i) => (
					<tspan key={i}>{ch}</tspan>
				))}
			</text>
		</g>
	);
}

type AnimationResult = {
	dx: number;
	dy: number;
	scale: number;
	rotation: number;
	skewX: number;
	opacity: number;
	blur: number;
};

function evaluateAdvancedPreset(
	preset: 'none' | 'vortex' | 'gravity' | 'magnetism' | 'fluidDynamics' | 'quantumFlicker' | 'dimensionalRift' | 'psychedelic' | 'glitchMatrix' | 'organicPulse' | 'cosmicDance' | 'neuralNetwork',
	phase: number,
	params: { amplitude: number; frequency: number; curve: string; complexity: number; chaos: number },
	index: number,
	count: number,
	time: number
): AnimationResult {
	const { amplitude, frequency, curve, complexity, chaos } = params;
	const center = (count - 1) / 2;
	const normalizedIndex = index / Math.max(1, count - 1);
	const distFromCenter = Math.abs(index - center) / Math.max(1, center);
	
	// Base result
	const result: AnimationResult = { dx: 0, dy: 0, scale: 1, rotation: 0, skewX: 0, opacity: 1, blur: 0 };
	
	switch (preset) {
		case 'none':
			return result;
			
		case 'vortex': {
			const spiral = phase + index * 0.3;
			const radius = amplitude * (0.5 + 0.5 * Math.sin(phase * 0.3)) * (1 - distFromCenter * 0.3);
			const vortexStrength = 1 + complexity * 2;
			
			result.dx = Math.cos(spiral * vortexStrength) * radius;
			result.dy = Math.sin(spiral * vortexStrength) * radius * 0.6;
			result.rotation = spiral * 15 * complexity;
			result.scale = 0.8 + 0.4 * (Math.sin(phase + index * 0.2) + 1) / 2;
			result.opacity = 0.7 + 0.3 * (Math.sin(phase * 1.3 + index * 0.15) + 1) / 2;
			break;
		}
		
		case 'gravity': {
			const gravityWell = Math.sin(phase * 0.4) * amplitude;
			const fallSpeed = Math.pow(normalizedIndex, 2) * complexity;
			const bounce = applyAdvancedEasing(Math.sin(phase * frequency + index * 0.1), 'bounce');
			
			result.dy = gravityWell + fallSpeed * bounce * amplitude * 0.8;
			result.dx = (Math.random() - 0.5) * chaos * amplitude * 0.3;
			result.scale = 1 - fallSpeed * 0.2;
			result.skewX = bounce * 5 * complexity;
			break;
		}
		
		case 'magnetism': {
			const magneticField = Math.sin(phase * frequency) * amplitude;
			const attraction = Math.cos(phase * 0.7 + index * 0.25) * complexity;
			const repulsion = Math.sin(phase * 1.3 - index * 0.2) * (1 - complexity);
			
			result.dx = (attraction - repulsion) * magneticField * 0.7;
			result.dy = Math.sin(phase * 2 + index * 0.3) * amplitude * 0.4;
			result.rotation = (attraction + repulsion) * 20;
			result.scale = 0.9 + 0.3 * Math.abs(attraction);
			break;
		}
		
		case 'fluidDynamics': {
			const flow1 = turbulentNoise(time * 0.5 + index * 0.1, 4) * amplitude;
			const flow2 = turbulentNoise(time * 0.3 + index * 0.15 + 100, 3) * amplitude;
			const viscosity = 1 - complexity * 0.5;
			
			result.dx = flow1 * viscosity;
			result.dy = flow2 * viscosity * 0.8;
			result.scale = 0.9 + 0.2 * turbulentNoise(time * 0.8 + index * 0.05, 2);
			result.opacity = 0.8 + 0.2 * Math.abs(Math.sin(phase + flow1 * 0.1));
			result.blur = chaos * 2;
			break;
		}
		
		case 'quantumFlicker': {
			const quantum = Math.random() < chaos * 0.1;
			const superposition = Math.sin(phase * frequency * 5 + index) * amplitude;
			const entanglement = Math.cos(phase * frequency * 3 - index * 0.5) * complexity;
			
			if (quantum) {
				result.dx = (Math.random() - 0.5) * amplitude * 2;
				result.dy = (Math.random() - 0.5) * amplitude * 2;
				result.opacity = Math.random() * 0.5 + 0.5;
			} else {
				result.dx = superposition * 0.3;
				result.dy = entanglement * amplitude * 0.4;
				result.opacity = 0.9 + 0.1 * Math.sin(phase * 10);
			}
			
			result.scale = 0.8 + 0.4 * Math.abs(superposition / amplitude);
			result.blur = quantum ? chaos * 3 : 0;
			break;
		}
		
		case 'dimensionalRift': {
			const rift = Math.sin(phase * 0.2) * complexity;
			const dimension = Math.floor(Math.abs(rift) * 3);
			const warp = Math.sin(phase * frequency + index * 0.4) * amplitude;
			
			switch (dimension) {
				case 0: // X dimension
					result.dx = warp * 1.5;
					result.skewX = rift * 15;
					break;
				case 1: // Y dimension
					result.dy = warp * 1.2;
					result.scale = 1 + rift * 0.5;
					break;
				case 2: // Z dimension (rotation)
					result.rotation = warp * 0.5 + rift * 45;
					result.opacity = 0.7 + 0.3 * Math.abs(rift);
					break;
			}
			
			result.blur = Math.abs(rift) * chaos * 4;
			break;
		}
		
		case 'psychedelic': {
			const rainbow = (phase + index * 0.2) % (Math.PI * 2);
			const trip = Math.sin(rainbow * 3) * amplitude * complexity;
			const fractal = turbulentNoise(time * 0.4 + index * 0.3, 6);
			
			result.dx = Math.cos(rainbow * 2) * trip;
			result.dy = Math.sin(rainbow * 1.5) * trip * 0.8;
			result.scale = 0.7 + 0.6 * (Math.sin(rainbow * 4) + 1) / 2;
			result.rotation = rainbow * 30 + fractal * 180 * chaos;
			result.skewX = Math.sin(rainbow * 2.5) * 10 * complexity;
			result.opacity = 0.8 + 0.2 * Math.abs(Math.sin(rainbow * 6));
			break;
		}
		
		case 'glitchMatrix': {
			const glitch = Math.random() < chaos * 0.2;
			const matrix = Math.sin(phase * frequency * 2 + index * 0.8) * amplitude;
			const digital = Math.floor(Math.sin(phase + index) * 8) / 8;
			
			if (glitch) {
				result.dx = (Math.random() - 0.5) * amplitude * 3;
				result.dy = Math.floor((Math.random() - 0.5) * amplitude * 2);
				result.scale = 0.5 + Math.random() * 1.5;
				result.opacity = Math.random() * 0.4 + 0.6;
				result.skewX = (Math.random() - 0.5) * 30;
			} else {
				result.dx = digital * amplitude * 0.5;
				result.dy = matrix * 0.3;
				result.scale = 0.9 + 0.2 * digital;
			}
			
			result.blur = glitch ? chaos * 5 : 0;
			break;
		}
		
		case 'organicPulse': {
			const heartbeat = Math.pow(Math.sin(phase * frequency), 4) * amplitude;
			const organic = turbulentNoise(time * 0.6 + index * 0.2, 3) * complexity;
			const pulse = Math.sin(phase * 3 + index * 0.1) * 0.5 + 0.5;
			
			result.dy = heartbeat * (0.8 + organic * 0.4);
			result.dx = organic * amplitude * 0.3;
			result.scale = 0.85 + 0.3 * pulse + organic * 0.1;
			result.opacity = 0.7 + 0.3 * pulse;
			result.blur = (1 - pulse) * chaos * 2;
			break;
		}
		
		case 'cosmicDance': {
			const orbit1 = Math.sin(phase * frequency + index * 0.1) * amplitude * 0.8;
			const orbit2 = Math.cos(phase * frequency * 0.7 + index * 0.15) * amplitude * 0.6;
			const cosmic = Math.sin(phase * 0.3) * complexity;
			const stellar = turbulentNoise(time * 0.2 + index * 0.4, 2);
			
			result.dx = orbit1 + stellar * amplitude * 0.2;
			result.dy = orbit2 + cosmic * amplitude * 0.4;
			result.rotation = phase * 10 + stellar * 45;
			result.scale = 0.8 + 0.4 * (Math.sin(phase * 2 + index * 0.3) + 1) / 2;
			result.opacity = 0.6 + 0.4 * Math.abs(cosmic);
			break;
		}
		
		case 'neuralNetwork': {
			const synapse = Math.sin(phase * frequency * 3 + index * 0.6) > 0.3 ? 1 : 0;
			const signal = synapse * amplitude * (Math.sin(phase * 5) + 1) / 2;
			const network = turbulentNoise(time * 0.7 + index * 0.25, 2) * complexity;
			
			result.dy = signal * 0.8 + network * amplitude * 0.3;
			result.dx = network * amplitude * 0.4;
			result.scale = synapse ? 1.2 + network * 0.3 : 0.8;
			result.opacity = synapse ? 1 : 0.4 + 0.3 * Math.abs(network);
			result.blur = synapse ? 0 : chaos * 3;
			break;
		}
	}
	
	// Apply chaos to all properties
	if (chaos > 0) {
		const chaosFactor = chaos * 0.3;
		result.dx += (Math.random() - 0.5) * amplitude * chaosFactor;
		result.dy += (Math.random() - 0.5) * amplitude * chaosFactor;
		result.rotation += (Math.random() - 0.5) * 10 * chaosFactor;
	}
	
	return result;
}

function applyAdvancedEasing(v: number, curve: string) {
	const clamp = (x: number) => Math.max(-1, Math.min(1, x));
	switch (curve) {
		case 'bounce':
			return clamp(Math.abs(v) * Math.sin(v * Math.PI * 4));
		case 'elastic':
			return clamp(v * Math.sin(v * Math.PI * 6) * Math.exp(-Math.abs(v) * 2));
		case 'back':
			return clamp(v * (2.7 * v * v - 1.7 * v));
		case 'easeIn':
			return clamp(v * v * v);
		case 'easeOut':
			return clamp(1 - Math.pow(1 - Math.abs(v), 3)) * Math.sign(v);
		case 'easeInOut':
			return clamp(v < 0 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2);
		default:
			return v;
	}
}

// Multi-octave turbulent noise
function turbulentNoise(x: number, octaves: number = 4): number {
	let value = 0;
	let amplitude = 1;
	let frequency = 1;
	
	for (let i = 0; i < octaves; i++) {
		value += Math.abs(perlin1D(x * frequency)) * amplitude;
		amplitude *= 0.5;
		frequency *= 2;
	}
	
	return (value - 0.5) * 2; // Normalize to -1..1
}

function perlin1D(x: number): number {
	const i = Math.floor(x);
	const f = x - i;
	const u = f * f * (3 - 2 * f);
	return lerp(hash(i), hash(i + 1), u);
}

function hash(n: number): number {
	const s = Math.sin(n * 127.1) * 43758.5453123;
	return (s - Math.floor(s)) * 2 - 1;
}

function lerp(a: number, b: number, t: number): number {
	return a + (b - a) * t;
}

function evaluateCursorInteraction(
	cursor: { mode: string; strength: number; radius: number; smoothing: number },
	mousePos: { x: number; y: number },
	charX: number,
	charY: number,
	time: number
): AnimationResult {
	const result: AnimationResult = { dx: 0, dy: 0, scale: 1, rotation: 0, skewX: 0, opacity: 1, blur: 0 };
	
	if (cursor.mode === 'none' || !mousePos.x || !mousePos.y) return result;
	
	// Calculate distance from cursor to character
	const dx = mousePos.x - charX;
	const dy = mousePos.y - charY;
	const distance = Math.sqrt(dx * dx + dy * dy);
	
	// Improved falloff curve - smoother transition
	const normalizedDistance = Math.max(0, Math.min(1, 1 - distance / cursor.radius));
	const easedDistance = normalizedDistance * normalizedDistance * (3 - 2 * normalizedDistance); // Smoothstep
	const influence = easedDistance * cursor.strength;
	
	if (influence <= 0.001) return result;
	
	// Smooth the influence based on smoothing setting - less jittery
	const smoothedInfluence = cursor.smoothing > 0 
		? influence * (0.8 + 0.2 * Math.sin(time * 2 + distance * 0.01)) 
		: influence;
	
	switch (cursor.mode) {
		case 'attract': {
			const pullStrength = smoothedInfluence * 80;
			if (distance > 1) { // Avoid division by zero
				result.dx = (dx / distance) * pullStrength;
				result.dy = (dy / distance) * pullStrength;
			}
			result.scale = 1 + smoothedInfluence * 0.5;
			result.opacity = Math.min(1, 1 + smoothedInfluence * 0.3);
			break;
		}
		
		case 'repel': {
			const pushStrength = smoothedInfluence * 100;
			if (distance > 1) { // Avoid division by zero
				result.dx = -(dx / distance) * pushStrength;
				result.dy = -(dy / distance) * pushStrength;
			}
			result.scale = Math.max(0.1, 1 - smoothedInfluence * 0.4);
			result.blur = smoothedInfluence * 4;
			result.opacity = Math.max(0.3, 1 - smoothedInfluence * 0.5);
			break;
		}
		
		case 'distort': {
			const warpStrength = smoothedInfluence * 40;
			result.dx = Math.sin(distance * 0.1 + time) * warpStrength;
			result.dy = Math.cos(distance * 0.08 + time) * warpStrength;
			result.skewX = smoothedInfluence * 15 * Math.sin(time * 2);
			result.scale = 1 + smoothedInfluence * 0.5 * Math.sin(distance * 0.05);
			result.blur = smoothedInfluence * 2;
			break;
		}
		
		case 'vortex': {
			const angle = Math.atan2(dy, dx) + smoothedInfluence * Math.PI * 2;
			const spiralRadius = smoothedInfluence * 50;
			result.dx = Math.cos(angle) * spiralRadius - dx * 0.1;
			result.dy = Math.sin(angle) * spiralRadius - dy * 0.1;
			result.rotation = smoothedInfluence * 180 + angle * 57.2958; // Convert to degrees
			result.scale = 1 + smoothedInfluence * 0.4;
			break;
		}
		
		case 'gravity': {
			const gravityStrength = smoothedInfluence * smoothedInfluence * 100;
			const falloff = Math.max(0.1, normalizedDistance);
			result.dx = (dx / distance) * gravityStrength * falloff;
			result.dy = (dy / distance) * gravityStrength * falloff + smoothedInfluence * 20; // Add downward pull
			result.scale = 1 - smoothedInfluence * 0.3;
			result.opacity = 1 - smoothedInfluence * 0.3;
			result.blur = smoothedInfluence * 4;
			break;
		}
	}
	
	return result;
}