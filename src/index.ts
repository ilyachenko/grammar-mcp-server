import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { handleSaveResponseTool } from './handlers/saveResponse.handler.js';
import { handleReadRandomFromLast10Tool } from './handlers/readLastFile.handler.js';
import { handleGrammarPracticeTool } from './handlers/grammarPractice.handler.js';
import { handleRemoveFileTool } from './handlers/removeFile.handler.js';

// Server instance
const server = new Server(
  {
    name: 'grammar-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
const tools: Tool[] = [
  {
    name: 'save_response',
    description: 'Save Claude response',
    inputSchema: {
      type: 'object',
      properties: {
        claude_response: {
          type: 'string',
          description: 'Claude response to save',
        },
      },
      required: ['claude_response'],
    },
  },
  {
    name: 'read_random_from_last_10',
    description: 'Read a random file from the last 10 saved files in data directory',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'grammar_practice',
    description: 'Generate practice questions based on file content',
    inputSchema: {
      type: 'object',
      properties: {
        file_content: {
          type: 'string',
          description: 'Content of the file to generate questions from',
        },
      },
      required: ['file_content'],
    },
  },
  {
    name: 'remove_file',
    description: 'Remove a specific file from the data directory',
    inputSchema: {
      type: 'object',
      properties: {
        filename: {
          type: 'string',
          description: 'Name of the file to remove',
        },
      },
      required: ['filename'],
    },
  },
];

// List tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools,
  };
});

// Call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {

  const { name, arguments: args } = request.params;

  switch (name) {
    case 'save_response':
      return handleSaveResponseTool(args);

    case 'read_random_from_last_10':
      return handleReadRandomFromLast10Tool();

    case 'grammar_practice':
      return handleGrammarPracticeTool(args);

    case 'remove_file':
      return handleRemoveFileTool(args);

    default:
      throw new Error(`Tool ${name} not found`);
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('MCP Server started successfully');
}

main().catch(console.error);