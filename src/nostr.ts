import { SimplePool, type Event } from "nostr-tools";

const pool = new SimplePool();
const relays = ["wss://relay.damus.io"];

export async function sendNostrEvent(event: Event) {
  const pubs = pool.publish(relays, event);
  return Promise.all(pubs);
}

export function listenForPayments(pk: string, callback: (evt: Event) => void) {
  pool.subscribe(relays, { kinds: [1059], "#p": [pk] }, { onevent: callback });
}
