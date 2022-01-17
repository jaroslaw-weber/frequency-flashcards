import { browser } from '$app/env';
import { writable } from 'svelte/store';

/** load object from local storage */
function loadFromStorage(key: string): any {
	if (browser) {
		console.log('loading...');
		let asString = localStorage.getItem(key);
		if (asString == undefined) return undefined;
		try {
			console.log(`loaded ${asString}`);

			return JSON.parse(asString);
		} catch (error) {
			console.log('not loaded');
			return undefined;
		}
	} else {
		console.log("not in browser")
		//throw new Error('not in browser');
	}
}

/** save object to local storage */
function saveToStorage(key: string, target: any) {
	if (browser) {
		let asJson = JSON.stringify(target);
		localStorage.setItem(key, asJson);
	}
}

let wordsToIgnoreRaw: string[] = loadFromStorage('wordsToIgnore') ?? [];

/** words that will be removed from list. this list is saved in localstorage */
export const wordsToIgnore = writable(new Set<string>(wordsToIgnoreRaw));

wordsToIgnore.subscribe((x) => {
	let asArray = [...x];
	console.log(`saving.... :${asArray}`);
	saveToStorage('wordsToIgnore', asArray);
});
