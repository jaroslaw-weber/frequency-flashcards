<script lang="ts">
	export let background = 'white';
	export let color = 'black';
</script>

<button class="border rounded shadow px-3 py-1 bg-{background} text-{color}" on:click
	><slot /></button
>
