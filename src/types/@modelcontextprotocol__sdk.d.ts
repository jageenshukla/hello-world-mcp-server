declare module '@modelcontextprotocol/sdk' {
    export interface RequestContext {
      reply(response: object): void;
    }
  
    export function createServer(): {
      on(event: string, handler: (context: RequestContext) => void): void;
      listen(port: number): Promise<void>;
    };
  }