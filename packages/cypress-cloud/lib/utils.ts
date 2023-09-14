import path from "path";

export function toArray(val?: string | string[]) {
	return val ? (typeof val === "string" ? [val] : val) : [];
}

export function toPosix(file: string, sep: string = path.sep) {
	return file.split(sep).join(path.posix.sep);
}

export function generateRandomString(length: number): string {
	const characters: string =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	let result: string = "";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}
