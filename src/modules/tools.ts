import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTools(server: McpServer) {
  // Math tool
  server.tool(
    "math-tool",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      num1: z.number(),
      num2: z.number(),
    },
    async ({ operation, num1, num2 }) => {
      let result: number;

      switch (operation) {
        case "add":
          result = num1 + num2;
          break;
        case "subtract":
          result = num1 - num2;
          break;
        case "multiply":
          result = num1 * num2;
          break;
        case "divide":
          if (num2 === 0) {
            throw new Error("Division by zero is not allowed.");
          }
          result = num1 / num2;
          break;
        default:
          throw new Error("Invalid operation.");
      }

      return {
        content: [{ type: "text", text: `Result: ${result}` }],
      };
    }
  );
}