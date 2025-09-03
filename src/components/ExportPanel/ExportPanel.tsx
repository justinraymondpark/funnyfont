import { useRef } from 'react';

export function ExportPanel() {
	const svgRef = useRef<SVGSVGElement | null>(null);

	function exportPng() {
		const node = document.querySelector('svg');
		if (!node) return;
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(node);
		const img = new Image();
		const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
		const url = URL.createObjectURL(svgBlob);
		img.onload = () => {
			const canvas = document.createElement('canvas');
			canvas.width = 1920; canvas.height = 1080;
			const ctx = canvas.getContext('2d');
			if (!ctx) return;
			ctx.drawImage(img, 0, 0);
			URL.revokeObjectURL(url);
			canvas.toBlob((blob) => {
				if (!blob) return;
				const a = document.createElement('a');
				a.href = URL.createObjectURL(blob);
				a.download = 'export.png';
				a.click();
			}, 'image/png');
		};
		img.src = url;
	}

	function exportSvg() {
		const node = document.querySelector('svg');
		if (!node) return;
		const serializer = new XMLSerializer();
		const svgString = serializer.serializeToString(node);
		const blob = new Blob([svgString], { type: 'image/svg+xml' });
		const a = document.createElement('a');
		a.href = URL.createObjectURL(blob);
		a.download = 'export.svg';
		a.click();
	}

	return (
		<div className="p-2 border-t border-white/10 flex gap-2">
			<button className="text-xs bg-white/10 rounded px-2 py-1" onClick={exportPng}>Export PNG</button>
			<button className="text-xs bg-white/10 rounded px-2 py-1" onClick={exportSvg}>Export SVG</button>
		</div>
	);
}


