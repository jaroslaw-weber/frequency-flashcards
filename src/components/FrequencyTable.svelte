<script lang="ts">
	import type { WordCount } from 'src/schema/WordCount';

	export let frequency: WordCount[] = [];
</script>

<div class="flex flex-col rounded border">
	<div class="flex bg-blue-400 text-white py-2 px-4 rounded-t">
		<p class="flex-1">word</p>
		<p class="flex-1">count</p>
	</div>
	{#each frequency as row}
		<div class="flex odd:bg-blue-50 py-2 px-4">
			<p class="flex-1">{row.word}</p>
			<p class="flex-1">{row.count}</p>
		</div>
	{/each}
</div>
