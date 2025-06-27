import { createAgent, gemini } from "@inngest/agent-kit";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event }) => {

    const codeAgent = createAgent({
      name: "code-agent",
      system: "You are an expert NextJs Developer.  You write readable maintanable code. You write simple NextJs Snippets.",
      model: gemini({ model: "gemini-2.0-flash" }),
    });


    const { output } = await codeAgent.run(
      `Write the following snippet:${event.data.value}`,
    );

    return { output };
  },
);
