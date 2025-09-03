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
			const t = ((now - start) / 1000) % motion.loopSeconds; // seconds looping
			const phase = (t / motion.loopSeconds) * Math.PI * 2; // 0..2π

			const g = groupRef.current;
			if (g) {
				for (let i = 0; i < g.children.length; i++) {
					const span = g.children[i] as SVGTextElement;
					const offset = i * motion.stagger;
					const res = evaluatePreset(motion.preset, phase + offset, motion, i, g.children.length);
					span.setAttribute('dy', res.dy.toFixed(2));
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
	preset: 'none' | 'wave' | 'drift' | 'jitter' | 'breathe' | 'bounce' | 'elastic' | 'ripple' | 'cascade' | 'typeOn',
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
			const prog = (Math.sin(phase) + 1) / 2; // 0..1
			const visible = index / count < prog;
			return { dy: visible ? 0 : amplitude * 0.5, opacity: visible ? 1 : 0 };
		}
		case 'typeOn': {
			const speed = Math.max(1, Math.floor(count / 12));
			const pos = Math.floor(((phase / (Math.PI * 2)) * 1000) / speed) % (count + 1);
			const visible = index < pos;
			return { dy: 0, opacity: visible ? 1 : 0 };
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


