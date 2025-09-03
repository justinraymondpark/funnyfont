import { useEffect, useMemo, useRef } from 'react';
import { useProjectStore } from '../state/useProjectStore';
import { ensureFontStylesheets } from '../services/FontManager';

export function PreviewSurface() {
	const { text, font, layout, color } = useProjectStore();
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		ensureFontStylesheets({ family: font.family, isVariable: font.isVariable, customCssUrl: font.url });
	}, [font.family, font.url, font.isVariable]);

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
				<text
					x="960"
					y="540"
					textAnchor={textAnchor as any}
					fill={color.mode === 'solid' ? color.solid : `url(#${gradientId})`}
					style={{
						fontFamily: `'${font.family}', system-ui, sans-serif`,
						fontSize: layout.fontSize,
						letterSpacing: layout.letterSpacing,
						lineHeight: layout.lineHeight,
						...fontVariation,
					}}
				>
					{text}
				</text>
			</svg>
		</div>
	);
}


