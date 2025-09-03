import { useProjectStore } from '../../state/useProjectStore';
import { useState } from 'react';

const variableExamples = [
	{ name: 'Inter', axes: ['wght'] },
	{ name: 'Roboto Flex', axes: ['wght', 'wdth', 'opsz'] },
	{ name: 'Recursive', axes: ['wght', 'slnt'] },
	{ name: 'Fraunces', axes: ['wght', 'opsz'] },
	{ name: 'Space Grotesk', axes: ['wght'] },
	{ name: 'Source Serif 4', axes: ['wght'] },
	{ name: 'Manrope', axes: ['wght'] },
	{ name: 'Plus Jakarta Sans', axes: ['wght'] },
	{ name: 'Lexend', axes: ['wght'] },
	{ name: 'Outfit', axes: ['wght'] },
	{ name: 'Figtree', axes: ['wght'] },
	{ name: 'Noto Sans', axes: ['wght'] },
	{ name: 'Noto Serif', axes: ['wght'] },
	{ name: 'Roboto Serif', axes: ['wght'] },
];

export function ControlsPanel() {
	const state = useProjectStore();
	const [customUrl, setCustomUrl] = useState('');

	return (
		<div className="h-full overflow-y-auto p-4 space-y-6">
			<section>
				<h2 className="text-sm uppercase tracking-widest text-white/60">Text</h2>
				<textarea
					className="mt-2 w-full h-24 bg-white/5 rounded p-2 text-sm"
					value={state.text}
					onChange={(e) => state.set('text', e.target.value)}
				/>
			</section>

			<section className="space-y-2">
				<h2 className="text-sm uppercase tracking-widest text-white/60">Font</h2>
				<select
					className="w-full bg-white/5 rounded p-2 text-sm"
					value={state.font.family}
					onChange={(e) => state.set('font', { ...state.font, family: e.target.value })}
				>
					{variableExamples.map((f) => (
						<option key={f.name} value={f.name}>{f.name}</option>
					))}
				</select>

				<div className="grid grid-cols-2 gap-2">
					<label className="text-xs opacity-70">Variable</label>
					<input type="checkbox" checked={state.font.isVariable} onChange={(e) => state.set('font', { ...state.font, isVariable: e.target.checked })} />
				</div>

				<input
					className="w-full bg-white/5 rounded p-2 text-xs"
					placeholder="Custom font CSS URL (e.g., https://fonts.googleapis.com/css2?... )"
					value={customUrl}
					onChange={(e) => setCustomUrl(e.target.value)}
				/>
				<button
					className="mt-1 text-xs bg-white/10 hover:bg-white/20 rounded px-2 py-1"
					onClick={() => state.set('font', { ...state.font, url: customUrl })}
				>
					Load CSS URL
				</button>

				{Object.entries(state.font.axes).map(([axis, val]) => (
					<div key={axis} className="mt-2">
						<label className="text-xs opacity-70">{axis}: {val}</label>
						<input
							type="range"
							min={100}
							max={900}
							step={1}
							value={val}
							onChange={(e) => state.set('font', { ...state.font, axes: { ...state.font.axes, [axis]: Number(e.target.value) } })}
							className="w-full"
						/>
					</div>
				))}
			</section>

			<section className="space-y-2">
				<h2 className="text-sm uppercase tracking-widest text-white/60">Layout</h2>
				<label className="text-xs opacity-70">Font Size: {state.layout.fontSize}px</label>
				<input type="range" min={24} max={300} value={state.layout.fontSize} onChange={(e) => state.set('layout', { ...state.layout, fontSize: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Letter Spacing: {state.layout.letterSpacing}px</label>
				<input type="range" min={-10} max={20} value={state.layout.letterSpacing} onChange={(e) => state.set('layout', { ...state.layout, letterSpacing: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Line Height: {state.layout.lineHeight}</label>
				<input type="range" min={0.8} max={2} step={0.01} value={state.layout.lineHeight} onChange={(e) => state.set('layout', { ...state.layout, lineHeight: Number(e.target.value) })} className="w-full" />
			</section>

			<section className="space-y-2">
				<h2 className="text-sm uppercase tracking-widest text-white/60">Color</h2>
				<div className="grid grid-cols-2 gap-2">
					<button className={`text-xs rounded px-2 py-1 ${state.color.mode === 'solid' ? 'bg-white/20' : 'bg-white/10'}`} onClick={() => state.set('color', { ...state.color, mode: 'solid' })}>Solid</button>
					<button className={`text-xs rounded px-2 py-1 ${state.color.mode === 'gradient' ? 'bg-white/20' : 'bg-white/10'}`} onClick={() => state.set('color', { ...state.color, mode: 'gradient' })}>Gradient</button>
				</div>
				{state.color.mode === 'solid' ? (
					<input type="color" value={state.color.solid} onChange={(e) => state.set('color', { ...state.color, solid: e.target.value })} />
				) : (
					<div className="space-y-2">
						<label className="text-xs opacity-70">Angle: {state.color.gradient.angle}°</label>
						<input type="range" min={0} max={360} value={state.color.gradient.angle} onChange={(e) => state.set('color', { ...state.color, gradient: { ...state.color.gradient, angle: Number(e.target.value) } })} className="w-full" />
						{state.color.gradient.stops.map((s, i) => (
							<div key={i} className="grid grid-cols-3 gap-2 items-center">
								<input type="range" min={0} max={1} step={0.01} value={s.pos} onChange={(e) => {
									const stops = [...state.color.gradient.stops];
									stops[i] = { ...s, pos: Number(e.target.value) };
									state.set('color', { ...state.color, gradient: { ...state.color.gradient, stops } });
								}} />
								<input type="color" value={s.color} onChange={(e) => {
									const stops = [...state.color.gradient.stops];
									stops[i] = { ...s, color: e.target.value };
									state.set('color', { ...state.color, gradient: { ...state.color.gradient, stops } });
								}} />
								<button className="text-xs bg-white/10 rounded px-2 py-1" onClick={() => {
									const stops = state.color.gradient.stops.filter((_, idx) => idx !== i);
									state.set('color', { ...state.color, gradient: { ...state.color.gradient, stops } });
								}}>Remove</button>
							</div>
						))}
						<button className="text-xs bg-white/10 rounded px-2 py-1" onClick={() => state.set('color', { ...state.color, gradient: { ...state.color.gradient, stops: [...state.color.gradient.stops, { pos: 0.5, color: '#ffffff' }] } })}>Add Stop</button>
					</div>
				)}
			</section>

			<section className="space-y-2">
				<h2 className="text-sm uppercase tracking-widest text-white/60">Motion</h2>
				<select
					className="w-full bg-white/5 rounded p-2 text-sm"
					value={state.motion.preset}
					onChange={(e) => state.set('motion', { ...state.motion, preset: e.target.value as any })}
				>
					<option value="none">None</option>
					<option value="vortex">🌪️ Vortex</option>
					<option value="gravity">🌍 Gravity</option>
					<option value="magnetism">🧲 Magnetism</option>
					<option value="fluidDynamics">🌊 Fluid Dynamics</option>
					<option value="quantumFlicker">⚛️ Quantum Flicker</option>
					<option value="dimensionalRift">🌀 Dimensional Rift</option>
					<option value="psychedelic">🌈 Psychedelic</option>
					<option value="glitchMatrix">💾 Glitch Matrix</option>
					<option value="organicPulse">💓 Organic Pulse</option>
					<option value="cosmicDance">✨ Cosmic Dance</option>
					<option value="neuralNetwork">🧠 Neural Network</option>
				</select>
				<label className="text-xs opacity-70">Amplitude: {state.motion.amplitude}px</label>
				<input type="range" min={0} max={100} value={state.motion.amplitude} onChange={(e) => state.set('motion', { ...state.motion, amplitude: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Frequency: {state.motion.frequency.toFixed(2)}</label>
				<input type="range" min={0.1} max={3} step={0.05} value={state.motion.frequency} onChange={(e) => state.set('motion', { ...state.motion, frequency: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Stagger: {state.motion.stagger.toFixed(2)}</label>
				<input type="range" min={0} max={0.3} step={0.01} value={state.motion.stagger} onChange={(e) => state.set('motion', { ...state.motion, stagger: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Loop Duration: {state.motion.loopSeconds}s</label>
				<input type="range" min={2} max={20} step={1} value={state.motion.loopSeconds} onChange={(e) => state.set('motion', { ...state.motion, loopSeconds: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Complexity: {state.motion.complexity.toFixed(2)}</label>
				<input type="range" min={0} max={1} step={0.01} value={state.motion.complexity} onChange={(e) => state.set('motion', { ...state.motion, complexity: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Chaos: {state.motion.chaos.toFixed(2)}</label>
				<input type="range" min={0} max={1} step={0.01} value={state.motion.chaos} onChange={(e) => state.set('motion', { ...state.motion, chaos: Number(e.target.value) })} className="w-full" />
				<label className="text-xs opacity-70">Curve: {state.motion.curve}</label>
				<select className="w-full bg-white/5 rounded p-2 text-sm" value={state.motion.curve} onChange={(e) => state.set('motion', { ...state.motion, curve: e.target.value as any })}>
					<option value="linear">Linear</option>
					<option value="easeIn">Ease In</option>
					<option value="easeOut">Ease Out</option>
					<option value="easeInOut">Ease In Out</option>
					<option value="bounce">Bounce</option>
					<option value="elastic">Elastic</option>
					<option value="back">Back</option>
				</select>
			</section>
		</div>
	);
}


