import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

export async function handleOpenFolderTool() {
  try {
    const dataDir = path.join(__dirname, '../../data');
    
    // Create data directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Use absolute path with open command
    await execAsync(`open "${dataDir}"`);
    
    return {
      content: [
        {
          type: 'text',
          text: `Data folder opened successfully at: ${dataDir}`,
        },
      ],
    };
  } catch (error) {
    const dataDir = path.join(__dirname, '../../data');
    return {
      content: [
        {
          type: 'text',
          text: `Error opening folder: ${error instanceof Error ? error.message : 'Unknown error'}. Attempted path: ${dataDir}`,
        },
      ],
      isError: true,
    };
  }
}