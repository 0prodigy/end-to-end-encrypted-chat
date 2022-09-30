<script type="ts">
  import { onMount } from "svelte";
  import { get, writable } from "svelte/store";
  import socket from "./io";
  import { encrypt, generateKeypair } from "./crypto";

  let input = "";
  let username = new Date().getTime();

  const messages = writable([]);
  const newUserPublicKey = writable("");
  const hamdleNewUser = (data) => {
    newUserPublicKey.set(data.publicKey);
  };

  onMount(() => {
    const publicKey = generateKeypair();
    const userdata = {
      user: username,
      publicKey,
      channel: "general",
    };
    socket.emit("create", userdata);
  });
  socket.on("nwuser", hamdleNewUser);
  socket.on("message", (data) => {
    messages.update((msgs) => [...msgs, data]);
  });

  function sendMessage() {
    if (!input) return;
    if (!get(newUserPublicKey)) return;
    socket.emit("message", encrypt(input, get(newUserPublicKey)));
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
