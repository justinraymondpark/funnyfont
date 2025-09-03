import { create } from 'zustand';

export type GradientStop = { pos: number; color: string };

export type ProjectState = {
	text: string;
	font: {
		family: string;
		url?: string;
		isVariable: boolean;
		axes: Record<string, number>;
	};
	layout: {
		fontSize: number;
		lineHeight: number;
		letterSpacing: number;
		align: 'left' | 'center' | 'right';
		kerning: boolean;
		wrap: 'none' | 'word' | 'char';
	};
	color: {
		mode: 'solid' | 'gradient';
		solid: string;
		gradient: { type: 'linear' | 'radial' | 'conic'; stops: GradientStop[]; angle: number };
	};
	motion: {
		preset: 'none' | 'wave' | 'drift' | 'jitter' | 'breathe' | 'bounce' | 'elastic' | 'ripple' | 'cascade' | 'typeOn' | 'liquid' | 'orbit' | 'swirl' | 'shimmer';
		amplitude: number;
		frequency: number;
		stagger: number;
		curve: 'linear' | 'easeInOut' | 'easeIn' | 'easeOut';
		loopSeconds: number;
	};
	renderer: 'svg';
};

type Actions = {
	set<K extends keyof ProjectState>(key: K, value: ProjectState[K]): void;
};

const defaultState: ProjectState = {
	text: 'The quick brown fox jumps over the lazy dog',
	font: { family: 'Inter', isVariable: true, axes: { wght: 600 } },
	layout: { fontSize: 120, lineHeight: 1.1, letterSpacing: 0, align: 'center', kerning: true, wrap: 'word' },
	color: {
		mode: 'solid',
		solid: '#ffffff',
		gradient: { type: 'linear', angle: 45, stops: [
			{ pos: 0, color: '#FF1CF7' },
			{ pos: 1, color: '#00F0FF' },
		] },
	},
	motion: { preset: 'wave', amplitude: 16, frequency: 0.5, stagger: 0.05, curve: 'easeInOut', loopSeconds: 6 },
	renderer: 'svg',
};

export const useProjectStore = create<ProjectState & Actions>((set) => ({
	...defaultState,
	set: (key, value) => set({ [key]: value } as any),
}));


