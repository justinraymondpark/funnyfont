import { PreviewSurface } from './PreviewSurface';
import { ExportPanel } from './ExportPanel/ExportPanel';

export function PreviewSurfaceWithExport() {
	return (
		<div className="h-full w-full flex flex-col">
			<div className="flex-1">
				<PreviewSurface />
			</div>
			<ExportPanel />
		</div>
	);
}


