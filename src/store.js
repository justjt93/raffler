import { writable } from "svelte/store"

export const participants = writable({})
export const tickets = writable([])
export const winningTickets = writable([])
export const numberOfPrizes = writable(4)