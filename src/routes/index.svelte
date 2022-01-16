<script lang="ts">
	import * as splitToWords from 'split-to-words';
	import DownloadButton from '../components/DownloadButton.svelte';
	import PrimaryButton from '../components/PrimaryButton.svelte';
	import SecondaryButton from '../components/SecondaryButton.svelte';

	class WordCount {
		word: string;
		count: number;
	}
	let placeholder =
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
	let sampleText: string =
		'This is sample text. You can see frequency list of words in this text in the table below.';
	let rawText: string = '';
	let frequencyArray: WordCount[] = [];

	let jsonBlob = undefined;
	let jsonBlobUrl = undefined;
	let csvBlob = undefined;
	let csvBlobUrl = undefined;

	function toCsv(data: any[]): string {
		let csv = '';
		let header = Object.keys(data[0]).join(',');
		let values = data.map((o) => Object.values(o).join(',')).join('\n');

		csv += header + '\n' + values;
		return csv;
	}
	function createBlob(text: string): Blob {
		return new Blob([text], { type: 'text/plain' });
	}

	function createBlobUrl(blob: Blob): string {
		return URL.createObjectURL(blob);
	}

	function goToUrl(url: string) {
		location.href = url;
	}

	function onClickProcess() {
		frequencyArray = getFrequencyList(rawText);
		//create downloadable json file
		createDownloadableFiles(frequencyArray);
	}

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
	<p class=" text-center text-gray-600">generate word frequency lists <br>and export them to Anki or Quizlet</p>

	<p class="pl-4 mt-10">paste your text below</p>

	<textarea rows="3" class="border rounded my-3 w-full p-3" {placeholder} bind:value={rawText} />
	<div class="flex items-center space-x-3">
		<PrimaryButton on:click={onClickProcess}>count words</PrimaryButton>
		<p>or</p>
		<SecondaryButton on:click={onClickTrySample}>see sample</SecondaryButton>
	</div>
	{#if frequencyArray.length > 0}
		<p class="text-3xl mt-10 mb-6 text-center ">word frequency list</p>
		<div class="flex flex-col rounded border">
			<div class="flex bg-blue-400 text-white py-2 px-4 rounded-t">
				<p class="flex-1">word</p>
				<p class="flex-1">count</p>
			</div>
			{#each frequencyArray as row}
				<div class="flex odd:bg-blue-50 py-2 px-4">
					<p class="flex-1">{row.word}</p>
					<p class="flex-1">{row.count}</p>
				</div>
			{/each}
		</div>
		<div class="my-6" />
		<DownloadButton url={jsonBlobUrl} filename="frequency-list.json"
			>download as json</DownloadButton
		>
		<p class="m-3">want to import to Anki or Quizlet?</p>
		<DownloadButton url={csvBlobUrl} filename="frequency-list.csv">download as csv</DownloadButton>
	{/if}
</section>
