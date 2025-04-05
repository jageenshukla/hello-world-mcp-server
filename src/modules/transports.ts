import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { Request, Response } from "express";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

const transports: { [sessionId: string]: SSEServerTransport } = {};

export function setupSSEEndpoint(app: any, server: McpServer) {
  app.get("/sse", async (_: Request, res: Response) => {
    const transport = new SSEServerTransport("/messages", res);
    transports[transport.sessionId] = transport;

    console.log(`SSE connection established. Session ID: ${transport.sessionId}`);

    res.on("close", () => {
      console.log(`SSE connection closed. Session ID: ${transport.sessionId}`);
      delete transports[transport.sessionId];
    });

    try {
      await server.connect(transport);
      console.log(`Transport connected to MCP server. Session ID: ${transport.sessionId}`);
    } catch (error) {
      console.error(`Error connecting transport to MCP server. Session ID: ${transport.sessionId}`, error);
    }
  });
}

export function setupMessageEndpoint(app: any) {
  app.post("/messages", async (req: Request, res: Response) => {
    const sessionId = req.query.sessionId as string;
    const transport = transports[sessionId] ?? Object.values(transports)[0];

    if (transport) {
      console.log(`Handling message for Session ID: ${sessionId}`);
      try {
        await transport.handlePostMessage(req, res);
      } catch (error) {
        console.error(`Error handling message for Session ID: ${sessionId}`, error);
        res.status(500).send("Internal Server Error");
      }
    } else {
      console.error(`No transport found for Session ID: ${sessionId}`);
      res.status(400).send("No transport found for sessionId");
    }
  });
}
