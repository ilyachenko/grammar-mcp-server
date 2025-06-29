import * as fs from 'fs';
import * as path from 'path';

export function handleRemoveFileTool(args: any) {
  try {
    if (!args?.filename) {
      return {
        content: [
          {
            type: 'text',
            text: 'Error: filename is required',
          },
        ],
        isError: true,
      };
    }

    const dataDir = path.join(__dirname, '../../data');
    const filePath = path.join(dataDir, args.filename);

    if (!fs.existsSync(filePath)) {
      return {
        content: [
          {
            type: 'text',
            text: `File ${args.filename} does not exist in data directory`,
          },
        ],
        isError: true,
      };
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return {
      content: [
        {
          type: 'text',
          text: `Successfully removed file: ${args.filename}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to remove file: ${error}`,
        },
      ],
      isError: true,
    };
  }
}