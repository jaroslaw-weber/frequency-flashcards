<script lang="ts">
	import type { WordCount } from 'src/schema/WordCount';
	import CustomButton from './CustomButton.svelte';

	import Fa from 'svelte-fa';
	import { faTrash } from '@fortawesome/free-solid-svg-icons';
	import { wordsToIgnore } from '../store';
	export let frequency: WordCount[] = [];

	function ignoreWord(word: string) {
		console.log(`removing word: ${word}`)
		wordsToIgnore.update((x) => x.add(word));
	}
</script>

<div class="flex flex-col rounded border">
	<div class="flex bg-blue-400 text-white py-2 px-4 rounded-t justify-between">
		<p class="flex-1">word</p>
		<p class="flex-1">count</p>
		<p class="flex-1 text-right">ignore</p>
	</div>
	{#each frequency as row}
		<div class="flex odd:bg-blue-50 py-2 px-4 items-center  justify-between">
			<p class="flex-1">{row.word}</p>
			<p class="flex-1">{row.count}</p>
			<p class="flex-1 text-red-300 text-right">
				<button on:click={() => ignoreWord(row.word)} >
				<Fa icon={faTrash} class="ml-auto pr-4" />
				</button>
			</p>
		</div>
	{/each}
</div>
