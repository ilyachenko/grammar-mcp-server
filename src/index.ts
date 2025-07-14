import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  ListToolsRequestSchema,
  CallToolRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { handleSaveResponseTool } from './handlers/saveResponse.handler.js';
import { handleSaveGrammarReportTool } from './handlers/saveGrammarReport.handler.js';
import { handleGrammarPracticeTool } from './handlers/grammarPractice.handler.js';
import { handleSummaryTool } from './handlers/summary.handler.js';
import { handleRemoveFileTool } from './handlers/removeFile.handler.js';
import { handleOpenFolderTool } from './handlers/openFolder.handler.js';

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
    description: 'Save Claude response - only use when user explicitly asks to save',
    inputSchema: {
      type: 'object',
      properties: {
        claude_response: {
          type: 'string',
          description: 'Claude response to save',
        },
        user_confirmed: {
          type: 'boolean',
          description: 'User has explicitly requested to save this response',
        },
      },
      required: ['claude_response', 'user_confirmed'],
    },
  },
  {
    name: 'save_grammar_report',
    description: 'Save grammar report from the same message where this command is used. Add new line after each block of text.',
    inputSchema: {
      type: 'object',
      properties: {
        message_content: {
          type: 'string',
          description: 'Content of the message containing the grammar report',
        },
      },
      required: ['message_content'],
    },
  },
  {
    name: 'grammar_practice',
    description: 'Generate practice questions from a random file in the last 10 saved files',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'grammar_summary',
    description: 'Analyze the last 10 saved files and prepare a summary report',
    inputSchema: {
      type: 'object',
      properties: {},
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
  {
    name: 'open_folder',
    description: 'Open the data folder in Finder',
    inputSchema: {
      type: 'object',
      properties: {},
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

    case 'save_grammar_report':
      return handleSaveGrammarReportTool(args);

    case 'grammar_practice':
      return handleGrammarPracticeTool();

    case 'grammar_summary':
      return handleSummaryTool();

    case 'remove_file':
      return handleRemoveFileTool(args);

    case 'open_folder':
      return handleOpenFolderTool();

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