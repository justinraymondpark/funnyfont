export function buildGoogleCss2Url(family: string, isVariable: boolean): string {
	const familyParam = isVariable
		? `${encodeURIComponent(family)}:ital,wght@0,100..900;1,100..900`
		: `${encodeURIComponent(family)}:wght@400;700`;
	return `https://fonts.googleapis.com/css2?family=${familyParam}&display=swap`;
}

export function ensureFontStylesheets(args: { family: string; isVariable: boolean; customCssUrl?: string }) {
	const { family, isVariable, customCssUrl } = args;
	const head = document.head || document.getElementsByTagName('head')[0];

	const googleId = `gf-${family}-${isVariable ? 'var' : 'static'}`;
	if (!document.getElementById(googleId)) {
		const link = document.createElement('link');
		link.id = googleId;
		link.rel = 'stylesheet';
		link.href = buildGoogleCss2Url(family, isVariable);
		head.appendChild(link);
	}

	if (customCssUrl) {
		const customId = `cf-${btoa(customCssUrl).replace(/=/g, '')}`;
		if (!document.getElementById(customId)) {
			const link = document.createElement('link');
			link.id = customId;
			link.rel = 'stylesheet';
			link.href = customCssUrl;
			head.appendChild(link);
		}
	}
}


