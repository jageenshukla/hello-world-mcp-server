import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerPrompts(server: McpServer) {
  server.prompt(
    "echo",
    { message: z.string() },
    ({ message }) => ({
      messages: [{
        role: "user",
        content: {
          type: "text",
          text: `Please process this message: ${message}`
        }
      }]
    })
  );
}
