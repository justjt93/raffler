<script>
	import { PROXY_URL } from "./const/const"
	import WinnerList from "./lib/WinnerList.svelte"
	import {
		participants,
		tickets,
		winningTickets,
		numberOfPrizes,
	} from "./store"
	let url = ""
	const generate = () => {
		const ticketArr = Object.keys($participants).reduce((acc, name) => {
			const { wins, paint, fair } = $participants[name]
			acc.push(
				getTicketString(name, "participation", 1),
				getTicketString(name, "placement", wins),
				getTicketString(name, "paint", paint),
				getTicketString(name, "fair play", fair)
			)
			return acc
		}, [])
		tickets.set(ticketArr.flat())
		winningTickets.set(generateWinningTickets($tickets))
	}

	const generateWinningTickets = (tickets) => {
		const winningTickets = []
		while (winningTickets.length < $numberOfPrizes) {
			const chosenTicket = tickets[Math.floor(Math.random() * tickets.length)]
			const [name] = chosenTicket.split("~")
			if (!winningTickets.includes(name)) {
				winningTickets.push(name)
			}
		}
		return winningTickets
	}

	const getTicketString = (name, category, count) => {
		const stringarr = []
		for (let i = 1; i <= count; i++) {
			stringarr.push(`${name} ~ ${category}-${i}`)
		}
		return stringarr
	}

	const getParticipantObjects = (names) => {
		const partObjects = {}
		names.forEach((name) => {
			partObjects[name] = {
				name,
				wins: 0,
				paint: 0,
				fair: 0,
			}
		})
		return partObjects
	}
	const fetchLS = async () => {
		fetch(`${PROXY_URL}${url}`)
			.then((response) => {
				return response.text()
			})
			.then((text) => {
				const parser = new DOMParser()
				const doc = parser.parseFromString(text, "text/html")
				const result = [
					...new Set(
						Array.from(doc.querySelectorAll("div>span>a.player_link")).map(
							(x) => x.innerHTML
						)
					),
				]
				participants.set(getParticipantObjects(result))
			})
	}
</script>

<main>
	<form class="content" on:submit|preventDefault={fetchLS}>
		<label class="labelName"
			>Event URL

			<input class="nameInput" type="text" bind:value={url} />
		</label>
		<button class="submitBtn" type="submit" disabled={url.length < 1}
			>Load participant list</button
		>
	</form>

	<h2>Participant list</h2>
	<form class="content" on:submit|preventDefault={generate}>
		{#each Object.keys($participants) as name, i}
			<label class="labelName"
				>{i + 1}

				<input class="nameInput" type="text" value={name} />
			</label>
			<label
				># wins

				<input type="number" bind:value={$participants[name].wins} />
			</label>
			<label
				># paint

				<input type="number" bind:value={$participants[name].paint} />
			</label>
			<label
				># fair

				<input type="number" bind:value={$participants[name].fair} />
			</label>
			<br />
		{/each}
		<label
			>Number of Prizes

			<input type="number" bind:value={$numberOfPrizes} />
		</label>
		<button
			class="submitBtn"
			type="submit"
			disabled={$numberOfPrizes > Object.keys($participants).length}
			>Generate Tickets</button
		>
	</form>

	{#each $tickets as ticket}
		<p>{ticket}</p>
	{/each}
	<br />
	<WinnerList />
</main>

<style>
	/* .content {
		display: grid;
		grid-template-columns: 20% 80%;
		grid-column-gap: 10px;
	} */
	input {
		width: 50px;
	}

	.nameInput {
		width: auto;
	}

	label {
		margin: 0 10px;
	}

	.labelName {
		margin-right: 25px;
	}

	.submitBtn {
		margin-top: 30px;
	}
</style>
