<script>
	import { winningTickets } from "../store"
</script>

<div>
	<h2>Raffle Winners</h2>
	<ol>
		{#each $winningTickets as ticket, i}
			<li>
				<p>{ticket}</p>
			</li>
		{/each}
	</ol>
</div>

<style>
</style>
