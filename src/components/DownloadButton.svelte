<script lang="ts">
	export let background = 'white';
	export let color = 'black';
	export let filename = 'file.txt';
	export let url = '';
</script>

<a
	class="border rounded shadow px-3 py-1 bg-{background} text-{color}"
	href={url}
	download={filename}
	on:click><slot /></a
>
