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

  for (const chunk of chunks) {
    // Simulate typing speed (very fast)
    await new Promise((resolve) => setTimeout(resolve, 1 + Math.random() * 2));
    onChunk(chunk);
  }
}
