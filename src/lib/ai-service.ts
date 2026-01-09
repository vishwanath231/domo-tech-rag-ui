export async function streamResponse(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  const sessionId = localStorage.getItem("session_id");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const response = await fetch(`http://127.0.0.1:8000/chat/${sessionId}/send`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: user._id,
      message: prompt,
    }),
  });

  const data = await response.json();

  // Extract the assistant_answer from the response
  const assistantAnswer = data?.assistant_answer || "";

  // Split the answer into chunks for streaming effect
  const chunks = assistantAnswer.split("");
  const BATCH_SIZE = 6;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    onChunk(chunks.slice(i, i + BATCH_SIZE).join(""));
    await new Promise((r) => setTimeout(r, 1));
  }

  // for (const chunk of chunks) {
  //   // Simulate typing speed (fast and snappy)
  //   await new Promise((resolve) => setTimeout(resolve, 3 + Math.random() * 5));
  //   onChunk(chunk);
  // }
}

export async function mcpStreamResponse(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(`http://localhost:5000/prompt`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: prompt,
    }),
  });
  const data = await response.json();

  const assistantAnswer = data?.reply || "";

  const chunks = assistantAnswer.split("");

  const BATCH_SIZE = 6;

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    onChunk(chunks.slice(i, i + BATCH_SIZE).join(""));
    await new Promise((r) => setTimeout(r, 1));
  }

  // for (const chunk of chunks) {
  //   // Simulate typing speed (fast and snappy)
  //   await new Promise((resolve) => setTimeout(resolve, 3 + Math.random() * 5));
  //   onChunk(chunk);
  // }
}
