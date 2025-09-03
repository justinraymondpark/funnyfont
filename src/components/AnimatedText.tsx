import { useEffect, useMemo, useRef } from 'react';
import { useProjectStore } from '../state/useProjectStore';

type Props = React.SVGProps<SVGTextElement> & { text: string };

export function AnimatedText({ text, ...rest }: Props) {
	const { motion } = useProjectStore();
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
					const res = evaluatePreset(motion.preset, phase + offset, motion, i, g.children.length);
					span.setAttribute('dy', res.dy.toFixed(2));
					span.setAttribute('dx', (res.dx ?? 0).toFixed(2));
					span.setAttribute('opacity', res.opacity.toFixed(2));
				}
			}
			rAF();
		};

		function rAF() {
			rafId = requestAnimationFrame(loop);
		}

		rAF();
		return () => cancelAnimationFrame(rafId);
	}, [motion.preset, motion.amplitude, motion.frequency, motion.stagger, motion.curve, motion.loopSeconds]);

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

function evaluatePreset(
	preset: 'none' | 'wave' | 'drift' | 'jitter' | 'breathe' | 'bounce' | 'elastic' | 'ripple' | 'cascade' | 'typeOn' | 'liquid' | 'orbit' | 'swirl' | 'shimmer',
	phase: number,
	params: { amplitude: number; frequency: number; curve: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' },
	index: number,
	count: number
) {
	const { amplitude, frequency, curve } = params;
	const s = Math.sin(phase * frequency);
	const eased = applyEasing(s, curve);
	const center = (count - 1) / 2;
	const distFromCenter = Math.abs(index - center);

	switch (preset) {
		case 'none':
			return { dy: 0, opacity: 1 };
		case 'wave':
			return { dy: eased * amplitude, opacity: 1 };
		case 'drift':
			return { dy: Math.sin(phase * frequency * 0.3) * amplitude * 0.5, opacity: 1 };
		case 'jitter':
			return { dy: (Math.random() * 2 - 1) * amplitude * 0.2, opacity: 1 };
		case 'breathe':
			return { dy: Math.sin(phase) * amplitude * 0.2, opacity: 0.85 + 0.15 * (0.5 + 0.5 * Math.sin(phase)) };
		case 'bounce': {
			const y = Math.abs(Math.sin(phase)) * amplitude;
			return { dy: y, opacity: 1 };
		}
		case 'elastic': {
			const damp = Math.exp(-distFromCenter * 0.1);
			return { dy: Math.sin(phase * frequency * 2) * amplitude * damp, opacity: 1 };
		}
		case 'ripple': {
			const ripplePhase = phase - distFromCenter * 0.3;
			return { dy: Math.sin(ripplePhase) * amplitude * 0.6, opacity: 1 };
		}
		case 'cascade': {
			const prog = (Math.sin(phase) + 1) / 2;
			const visible = index / count < prog;
			return { dy: visible ? 0 : amplitude * 0.5, opacity: visible ? 1 : 0 };
		}
		case 'typeOn': {
			const speed = Math.max(1, Math.floor(count / 12));
			const pos = Math.floor(((phase / (Math.PI * 2)) * 1000) / speed) % (count + 1);
			const visible = index < pos;
			return { dy: 0, opacity: visible ? 1 : 0 };
		}
		case 'liquid': {
			const n = perlin1D(phase * 0.5 + index * 0.15);
			return { dy: n * amplitude, dx: n * amplitude * 0.25, opacity: 1 };
		}
		case 'orbit': {
			const a = phase + index * 0.12;
			return { dy: Math.sin(a) * amplitude * 0.6, dx: Math.cos(a) * amplitude * 0.6, opacity: 1 };
		}
		case 'swirl': {
			const a = phase * 1.2 + index * 0.22;
			const r = amplitude * (0.25 + (index / Math.max(1, count - 1)) * 0.75);
			return { dy: Math.sin(a) * r, dx: Math.cos(a) * r * 0.6, opacity: 1 };
		}
		case 'shimmer': {
			const flick = 0.7 + 0.3 * ((Math.sin(phase * 2 + index * 0.45) + 1) / 2);
			return { dy: 0, dx: 0, opacity: flick };
		}
	}
}

function applyEasing(v: number, curve: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut') {
	const clamp = (x: number) => Math.max(-1, Math.min(1, x));
	switch (curve) {
		case 'easeIn':
			return clamp(v * v);
		case 'easeOut':
			return clamp(Math.sqrt(Math.abs(v)) * Math.sign(v));
		case 'easeInOut':
			return clamp(0.5 * (Math.sin((v * Math.PI) / 2) + Math.sign(v)));
		default:
			return v;
	}
}

// lightweight 1D noise for liquid preset
function perlin1D(x: number) {
	const i = Math.floor(x);
	const f = x - i;
	const u = f * f * (3 - 2 * f);
	return lerp(hash(i), hash(i + 1), u);
}

function hash(n: number) {
	const s = Math.sin(n * 127.1) * 43758.5453123;
	return (s - Math.floor(s)) * 2 - 1;
}

function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}
