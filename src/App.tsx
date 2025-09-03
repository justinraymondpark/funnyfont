import { ControlsPanel } from './components/ControlsPanel/ControlsPanel';
import { PreviewSurfaceWithExport } from './components/PreviewSurfaceWithExport';

export default function App() {
	return (
		<div className="min-h-screen w-full bg-neutral-950 text-neutral-200 grid grid-cols-12">
			<div className="col-span-9">
				<PreviewSurfaceWithExport />
			</div>
			<div className="col-span-3 border-l border-white/10">
				<ControlsPanel />
			</div>
		</div>
	);
}


