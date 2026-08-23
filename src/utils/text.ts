export function sanitizeText(str: string): string {
	if (!str) return "";
	return str
		.replace(/Ö/g, "Í")
		.replace(/ö/g, "í")
		.replace(/à/g, "Á")
		.replace(/§/g, "º")
		.replace(/\s+/g, " ")
		.trim();
}
