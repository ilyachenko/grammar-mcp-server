# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an MCP (Model Context Protocol) server for grammar practice. It provides tools for saving Claude responses, reading saved files, generating grammar practice questions, managing files, and opening the data folder.

## Development Commands

### Build and Run
- `npm run build` - Compile TypeScript to JavaScript in dist/
- `npm start` - Run the compiled server from dist/
- `npm run dev` - Run directly with ts-node for development
- `npm run watch` - Run with nodemon for auto-restart on changes
- `npm run watch:build` - Watch mode for TypeScript compilation

### Testing
- `npm test` - Run Jest tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report

## Architecture

The server is built using the @modelcontextprotocol/sdk and provides 5 main tools:

1. **save_response** - Saves Claude responses to timestamped files in data/
2. **read_random_from_last_10** - Reads a random file from the 10 most recent files
3. **grammar_practice** - Generates practice questions from file content
4. **remove_file** - Removes specific files from data directory
5. **open_folder** - Opens the data folder in Finder (macOS)

### Code Structure
- `src/index.ts` - Main server setup with tool definitions and request handlers
- `src/handlers/` - Individual tool handlers, each in separate files
- `data/` - Directory where responses are saved as timestamped .txt files
- `tests/` - Test files (Jest configuration in jest.config.js)

### Key Dependencies
- @modelcontextprotocol/sdk - Core MCP functionality
- zod - Schema validation
- TypeScript with strict mode enabled

The server uses stdio transport and starts with console.error logging for MCP client communication.