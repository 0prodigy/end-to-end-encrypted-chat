<script type="ts">
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { io } from "socket.io-client";
  import { generatePair } from "./crypto";

  let input = "";
  let username = new Date().getTime();
  const socket = io("http://localhost:3000");

  const messages = writable([]);

  onMount(() => {
    socket.on("connection", () => {
      const { publicKey, privateKey } = generatePair();
      const user = {
        user: username,
        publicKey,
        channel: "general",
      };
    });
    socket.on("message", (msg) => {
      messages.update((msgs) => [...msgs, msg]);
    });
  });

  function sendMessage() {
    socket.emit("message", input);
    input = "";
  }
</script>

<main>
  <ul>
    {#each $messages as msg}
      <li>{msg}</li>
    {/each}
  </ul>
  <input type="text" id="message" bind:value={input} />
  <button on:click={sendMessage}>Send</button>
</main>
