<script>
  import { sendMessageToChatGPT } from "../api/chatgpt.js";

  let userMessage = ""; // Benutzereingabe
  let chatResponse = ""; // Antwort von ChatGPT
  let loading = false; // Zeigt an, ob eine Anfrage läuft

  async function sendMessage() {
    if (!userMessage.trim()) return;

    loading = true;
    try {
      // Nachricht an ChatGPT senden und Antwort speichern
      chatResponse = await sendMessageToChatGPT(userMessage);
    } catch (error) {
      chatResponse = "Ein Fehler ist aufgetreten. Bitte versuche es erneut.";
    } finally {
      loading = false;
    }
  }
</script>

<div>
  <h2>Chat mit GPT</h2>
  <textarea bind:value={userMessage} placeholder="Schreibe eine Nachricht..."></textarea>
  <button on:click={sendMessage} {disabled: loading}>
    {loading ? "Lädt..." : "Senden"}
  </button>
</div>

{#if chatResponse}
  <div class="response">
    <h3>Antwort:</h3>
    <p>{chatResponse}</p>
  </div>
{/if}

<style>
  textarea {
    width: 100%;
    height: 100px;
    margin-bottom: 1rem;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 0.5rem 1rem;
    background-color: #2e7d32;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  button:disabled {
    background-color: grey;
    cursor: not-allowed;
  }
  .response {
    margin-top: 1rem;
    padding: 1rem;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 5px;
  }
</style>