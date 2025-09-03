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
					const value = evaluatePreset(motion.preset, phase + offset, motion);
					span.setAttribute('dy', value.toFixed(2));
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
	preset: 'none' | 'wave' | 'drift' | 'jitter',
	phase: number,
	params: { amplitude: number; frequency: number; curve: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut' }
) {
	const { amplitude, frequency, curve } = params;
	const eased = applyEasing(Math.sin(phase * frequency), curve);
	if (preset === 'none') return 0;
	if (preset === 'wave') return eased * amplitude;
	if (preset === 'drift') return Math.sin(phase * frequency * 0.3) * amplitude * 0.5;
	if (preset === 'jitter') return (Math.random() * 2 - 1) * amplitude * 0.2;
	return 0;
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


