export async function streamResponse(
  prompt: string,
  onChunk: (chunk: string) => void
) {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const response = `This is a simulated response to: "${prompt}". 
  
Here is some example code:
\`\`\`typescript
const greeting = "Hello World";
console.log(greeting);
\`\`\`

I can generate long text to test the scrolling behavior. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

- Point 1
- Point 2
- Point 3

Hope this helps!`;

  const chunks = response.split("");

  for (const chunk of chunks) {
    // Simulate typing speed
    await new Promise((resolve) =>
      setTimeout(resolve, 15 + Math.random() * 30)
    );
    onChunk(chunk);
  }
}
