export const challenges = [
	{
		id: 'c1',
		number: '01',
		title: 'Fremde Quittung',
		category: 'A01:2025 · Broken Access Control',
		cwe: 'CWE-639',
		cweName: 'Authorization Bypass Through User-Controlled Key',
		source: 'https://cwe.mitre.org/data/definitions/639.html',
		reference:
			'Didaktische Nachbildung mit Bezug auf CVE-2025-65647 – PHPGurukul Online Shopping Portal 2.1.',
		cve: 'https://www.cve.org/CVERecord?id=CVE-2025-65647',
		goal: 'Ein anderer Kunde hat etwas Besonderes bestellt. Finde heraus, was.',
		entry: '/orders',
		entryLabel: 'Zu deinen Bestellungen',
		precondition: 'Als Alice anmelden und eine eigene Bestellung öffnen.',
		success: 'Finde das Flag in einer fremden Bestellnotiz und reiche es hier ein.',
		hint: 'Schau dir die URL deiner Bestellung genau an.',
		objective:
			'Authentifizierung und Autorisierung unterscheiden. Ein Objektzugriff muss auch den Besitzer prüfen.'
	},
	{
		id: 'c2',
		number: '02',
		title: 'Suchmaschinen-Optimierung',
		category: 'A05:2025 · Injection',
		cwe: 'CWE-79',
		cweName: 'Improper Neutralization of Input During Web Page Generation',
		source: 'https://cwe.mitre.org/data/definitions/79.html',
		reference:
			'Didaktische Nachbildung mit Bezug auf CVE-2020-5272 – PrestaShop ab 1.5.5.0 und vor 1.7.6.5.',
		cve: 'https://www.cve.org/CVERecord?id=CVE-2020-5272',
		goal: 'Präpariere einen Suchlink, über den du die private Bestellnotiz von Bob erhältst.',
		entry: '/search',
		entryLabel: 'Zur Produktsuche',
		precondition:
			'Alice als Angreiferin. Bob öffnet den Link in einem separaten Browserprofil mit eigener Anmeldung.',
		success:
			'Code in Bobs Browser liest /api/private-note und sendet die Notiz als JSON {token, note} an POST /api/challenges/c2/collect. Alice erhält danach das Flag in dieser Ansicht. Ein alert allein genügt nicht.',
		hint: 'Was passiert mit deinem Suchbegriff im HTML? Welche Shopdaten darf Bob sehen, Alice aber nicht?',
		objective:
			'Verstehen, wie reflektiertes XSS im Kontext einer fremden Sitzung private fiktive Daten offenlegen kann.'
	},
	{
		id: 'c3',
		number: '03',
		title: 'Gutschein-Chaos',
		category: 'A06:2025 · Insecure Design',
		cwe: 'CWE-837',
		cweName: 'Improper Enforcement of a Single, Unique Action',
		source: 'https://cwe.mitre.org/data/definitions/837.html',
		reference:
			'Didaktische Nachbildung mit Bezug auf CVE-2026-112285 – Thelia ab 2.6.2 und vor 3.1.5 sowie ab 3.2.0 und vor 3.2.4.',
		cve: 'https://www.cve.org/CVERecord?id=CVE-2026-112285',
		goal: 'Golden Labubu kostet 1.337,00 €. Dein Guthaben beträgt 20,00 €. Nutze den Gutscheinfehler, um ihn trotzdem zu bestellen.',
		entry: '/products/6',
		entryLabel: 'Golden Labubu ansehen',
		precondition:
			'Als Bob anmelden. Golden Labubu in den Warenkorb legen. Gutschein: LABUBU20 (20 %).',
		success:
			'Bestelle das Flag-Produkt mit fünf Anwendungen desselben Codes für 0,00 €. Das Flag erscheint in der Bestellbestätigung.',
		hint: 'Was passiert, wenn du denselben Gutscheincode erneut einlöst?',
		objective:
			'Fehlende Geschäftsregeln erkennen: Einzeln gültige Rabatte können in Kombination den Bestellbetrag verfälschen.'
	}
];
