import { useEffect, useMemo, useRef, useState } from 'react';
import { useProjectStore } from '../state/useProjectStore';
import { ensureFontStylesheets } from '../services/FontManager';
import { AnimatedText } from './AnimatedText';

export function PreviewSurface() {
	const { text, font, layout, color, cursor } = useProjectStore();
	const containerRef = useRef<HTMLDivElement>(null);
	const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

	useEffect(() => {
		ensureFontStylesheets({ family: font.family, isVariable: font.isVariable, customCssUrl: font.url });
	}, [font.family, font.url, font.isVariable]);

	useEffect(() => {
		const handleMouseMove = (e: MouseEvent) => {
			if (containerRef.current) {
				const rect = containerRef.current.getBoundingClientRect();
				// Convert to SVG coordinate space (1920x1080) with proper scaling
				const x = ((e.clientX - rect.left) / rect.width) * 1920;
				const y = ((e.clientY - rect.top) / rect.height) * 1080;
				setMousePos({ x, y });
			}
		};

		if (cursor.mode !== 'none') {
			// Use container-specific event listener for better accuracy
			const container = containerRef.current;
			if (container) {
				container.addEventListener('mousemove', handleMouseMove);
				return () => container.removeEventListener('mousemove', handleMouseMove);
			}
		}
	}, [cursor.mode]);

	const gradientId = useMemo(() => `grad-${Math.random().toString(36).slice(2)}`,[color]);
	const fontVariation = useMemo(() => {
		if (!font.isVariable) return undefined;
		const axes = Object.entries(font.axes).map(([k, v]) => `'${k}' ${v}`).join(', ');
		return axes ? { fontVariationSettings: axes } as React.CSSProperties : undefined;
	}, [font.axes, font.isVariable]);

	const textAnchor = layout.align === 'center' ? 'middle' : layout.align === 'right' ? 'end' : 'start';

	return (
		<div ref={containerRef} className="h-full w-full relative">
			<svg className="absolute inset-0 h-full w-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
				<defs>
					{color.mode === 'gradient' && (
						<linearGradient id={gradientId} gradientTransform={`rotate(${color.gradient.angle})`}>
							{color.gradient.stops.map((s) => (
								<stop key={s.pos} offset={s.pos} stopColor={s.color} />
							))}
						</linearGradient>
					)}
				</defs>
				<rect x="0" y="0" width="100%" height="100%" fill="#0b0b0f" />
				{/* Debug cursor indicator */}
				{cursor.mode !== 'none' && (
					<circle
						cx={mousePos.x}
						cy={mousePos.y}
						r={cursor.radius}
						fill="none"
						stroke="rgba(255,255,255,0.1)"
						strokeWidth="1"
					/>
				)}
				<AnimatedText
					x={960}
					y={540}
					textAnchor={textAnchor as any}
					fill={color.mode === 'solid' ? color.solid : `url(#${gradientId})`}
					style={{
						fontFamily: `'${font.family}', system-ui, sans-serif`,
						fontSize: layout.fontSize,
						letterSpacing: layout.letterSpacing,
						lineHeight: layout.lineHeight,
						...fontVariation,
					}}
					text={text}
					mousePos={mousePos}
				/>
			</svg>
		</div>
	);
}


