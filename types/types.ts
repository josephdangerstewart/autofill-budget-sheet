export interface PlaidTransaction {
	categories: string[];
	amount: number;
	id: string;
	date: Date;
	merchantName: string;
	rawName: string;
}

export interface DataSheet<T extends Record<string, string>> {
	dataStartsAtRow: number;
	name: string;
	columns: T;
}

export type DataSheetRow<T extends string | number | symbol> = {
	[key in T]: string | undefined;
}
