<script lang="ts">
	import * as splitToWords from 'split-to-words';
	import { WordCount } from '../schema/WordCount';
	import DownloadButton from '../components/DownloadButton.svelte';
	import PrimaryButton from '../components/PrimaryButton.svelte';
	import SecondaryButton from '../components/SecondaryButton.svelte';
	import FrequencyTable from '../components/FrequencyTable.svelte';

	let placeholder =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	let sampleText: string =
		'This is sample text. You can see frequency list of words in this text in the table below.';
	let rawText: string = '';
	let frequency: WordCount[] = [];
	let jsonBlob: Blob = undefined;
	let jsonBlobUrl: string = undefined;
	let csvBlob: Blob = undefined;
	let csvBlobUrl: string = undefined;

	/** convert array to csv */
	function toCsv(data: any[]): string {
		let csv = '';
		let header = Object.keys(data[0]).join(',');
		let values = data.map((o) => Object.values(o).join(',')).join('\n');

		csv += header + '\n' + values;
		return csv;
	}

	/** converts string to blob (for donwloading) */
	function createBlob(text: string): Blob {
		return new Blob([text], { type: 'text/plain' });
	}

	function createBlobUrl(blob: Blob): string {
		return URL.createObjectURL(blob);
	}

	function onClickProcess() {
		frequency = getFrequencyList(rawText);
		//create downloadable json file
		createDownloadableFiles(frequency);
	}

	/** prepares .json and .csv files */
	function createDownloadableFiles(array: any[]) {
		jsonBlob = createBlob(JSON.stringify(array));
		jsonBlobUrl = createBlobUrl(jsonBlob);
		//create downloadable csv file
		let csv = toCsv(array);
		csvBlob = createBlob(csv);
		csvBlobUrl = createBlobUrl(csvBlob);
	}

	function onClickTrySample() {
		rawText = sampleText;
		onClickProcess();
	}

	/** convert raw text to word frequency list */
	function getFrequencyList(input: string): WordCount[] {
		let list = [];
		const words = splitToWords(input);
		let counted = countWords(words);
		Object.keys(counted).forEach((key) => {
			let wordCount = new WordCount();
			wordCount.word = key;
			wordCount.count = counted[key];
			list.push(wordCount);
		});
		list.sort((a, b) => b.count - a.count);
		return list;
	}

	function countWords(words: string[]) {
		let frequencies = {};
		words.forEach((word) => {
			let count = frequencies[word];
			if (count == undefined) count = 0;
			count++;
			frequencies[word] = count;
		});
		return frequencies;
	}
</script>

<section class=" p-8 lg:p-0 lg:w-1/2 lg:mx-auto mt-12 mb-20">
	<p class="text-3xl mb-6  text-center text-blue-600">frequency flashcards</p>
	<p class=" text-center text-gray-600">
		generate word frequency lists <br />and export them to Anki or Quizlet
	</p>

	<p class="pl-4 mt-10">paste your text below</p>

	<textarea rows="3" class="border rounded my-3 w-full p-3" {placeholder} bind:value={rawText} />
	<div class="flex items-center space-x-3">
		<PrimaryButton on:click={onClickProcess}>count words</PrimaryButton>
		<p>or</p>
		<SecondaryButton on:click={onClickTrySample}>see sample</SecondaryButton>
	</div>
	{#if frequency.length > 0}
		<p class="text-3xl mt-10 mb-6 text-center ">word frequency list</p>
		<FrequencyTable {frequency} />

		<div class="my-6" />
		<DownloadButton url={jsonBlobUrl} filename="frequency-list.json"
			>download as json</DownloadButton
		>
		<p class="m-3">want to import to Anki or Quizlet?</p>
		<DownloadButton url={csvBlobUrl} filename="frequency-list.csv">download as csv</DownloadButton>
	{/if}
</section>
