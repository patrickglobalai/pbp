import OpenAI from 'openai';

const ASSISTANT_ID = import.meta.env.VITE_OPENAI_ASSISTANT_ID;

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function getAIAnalysis(prompt: string) {
  try {
    console.log('Starting analysis with prompt:', prompt);

    // Create a thread
    const thread = await openai.beta.threads.create();
    console.log('Thread created:', thread.id);

    // Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: prompt
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: ASSISTANT_ID
    });

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    
    while (runStatus.status === "queued" || runStatus.status === "in_progress") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    if (runStatus.status === "failed") {
      throw new Error("Assistant run failed");
    }

    if (runStatus.status === "completed") {
      // Get the assistant's response
      const messages = await openai.beta.threads.messages.list(thread.id);
      const lastMessage = messages.data[0];

      // Clean up the thread
      await openai.beta.threads.del(thread.id);

      return lastMessage.content[0].text.value;
    }

    throw new Error("Unexpected run status: " + runStatus.status);

  } catch (error) {
    console.error('Error in AI analysis:', error);
    return 'I apologize, but I encountered an error while analyzing your results. Please try again.';
  }
}