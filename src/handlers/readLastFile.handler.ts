import * as fs from 'fs';
import * as path from 'path';

export function handleReadRandomFromLast10Tool() {
  try {
    const dataDir = path.join(__dirname, '../../data');
    
    if (!fs.existsSync(dataDir)) {
      return {
        content: [
          {
            type: 'text',
            text: 'Data directory does not exist',
          },
        ],
        isError: true,
      };
    }

    const files = fs.readdirSync(dataDir)
      .filter(file => file.endsWith('.txt'))
      .map(file => ({
        name: file,
        path: path.join(dataDir, file),
        mtime: fs.statSync(path.join(dataDir, file)).mtime
      }))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime())
      .slice(0, 10);

    if (files.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: 'No files found in data directory',
          },
        ],
      };
    }

    const randomIndex = Math.floor(Math.random() * files.length);
    const randomFile = files[randomIndex];
    const content = fs.readFileSync(randomFile.path, 'utf8');

    return {
      content: [
        {
          type: 'text',
          text: `Random file from last 10: ${randomFile.name}\n\nContent:\n${content}`,
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Failed to read random file: ${error}`,
        },
      ],
      isError: true,
    };
  }
}