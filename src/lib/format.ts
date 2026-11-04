export const euro = (cents: number) =>
	new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
export const date = (value: string | Date) =>
	new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium', timeStyle: 'short' }).format(
		new Date(value)
	);
