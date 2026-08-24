import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ReactQueryClientProvider } from "@/providers/query-client-provider";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	display: "swap",
	variable: "--font-sans",
});

export const viewport: Viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	viewportFit: "cover",
	themeColor: "#f8fafc",
};

export const metadata: Metadata = {
	title: "Radares e Câmeras do Recife | Mapa Interativo CTTU",
	description:
		"Mapa interativo de localização de radares de velocidade, lombadas eletrônicas e câmeras de monitoramento da CTTU na cidade do Recife.",
	keywords: [
		"radares recife",
		"lombadas eletronicas recife",
		"cameras de transito cttu",
		"cttu recife",
		"mapa de radares",
	],
	authors: [{ name: "Gabriel Feijó" }],
	openGraph: {
		title: "Radares e Câmeras do Recife | Mapa Interativo",
		description:
			"Consulte a localização e detalhes de todos os radares e câmeras de monitoramento do Recife.",
		type: "website",
		locale: "pt_BR",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR">
			<head>
				<meta
					httpEquiv="Content-Security-Policy"
					content="upgrade-insecure-requests"
				/>
			</head>
			<body
				className={`${plusJakartaSans.variable} ${plusJakartaSans.className} font-sans`}
			>
				<ReactQueryClientProvider>{children}</ReactQueryClientProvider>
			</body>
		</html>
	);
}
