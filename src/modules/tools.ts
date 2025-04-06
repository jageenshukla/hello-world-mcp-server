import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function registerTools(server: McpServer) {
  // Math tool
  server.tool(
    "math-tool",
    {
      operation: z.enum(["add", "subtract", "multiply", "divide"]),
      num1: z.string(),
      num2: z.string(),
    },
    async ({ operation, num1, num2 }) => {
      console.log(`Received request: operation=${operation}, num1=${num1}, num2=${num2}`);

      // Attempt to convert num1 and num2 to numbers if they are strings
      const parsedNum1 = typeof num1 === "string" ? parseFloat(num1) : num1;
      const parsedNum2 = typeof num2 === "string" ? parseFloat(num2) : num2;

      // Validate that the parsed values are numbers
      if (isNaN(parsedNum1) || isNaN(parsedNum2)) {
        console.error("Invalid input: num1 and num2 must be valid numbers.");
        throw new Error("Invalid input: num1 and num2 must be valid numbers.");
      }

      let result: number;

      switch (operation) {
        case "add":
          result = parsedNum1 + parsedNum2;
          console.log(`Addition performed: ${parsedNum1} + ${parsedNum2} = ${result}`);
          break;
        case "subtract":
          result = parsedNum1 - parsedNum2;
          console.log(`Subtraction performed: ${parsedNum1} - ${parsedNum2} = ${result}`);
          break;
        case "multiply":
          result = parsedNum1 * parsedNum2;
          console.log(`Multiplication performed: ${parsedNum1} * ${parsedNum2} = ${result}`);
          break;
        case "divide":
          if (parsedNum2 === 0) {
            console.error("Division by zero is not allowed.");
            throw new Error("Division by zero is not allowed.");
          }
          result = parsedNum1 / parsedNum2;
          console.log(`Division performed: ${parsedNum1} / ${parsedNum2} = ${result}`);
          break;
        default:
          console.error("Invalid operation.");
          throw new Error("Invalid operation.");
      }

      console.log(`Operation successful: Result = ${result}`);

      return {
        content: [{ type: "text", text: `Result: ${result}` }],
      };
    }
  );
}