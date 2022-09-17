<script>
	import { winningTickets } from "../store"
</script>
<h2> Raffle Winners</h2>
  <ol>
    {#each $winningTickets as ticket, i}
		<li>
      <p>{ticket}</p>
		</li>
    {/each}
  </ol>

<style>
</style>
