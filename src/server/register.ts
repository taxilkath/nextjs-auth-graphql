// This file helps with TypeScript module resolution
import { register } from 'tsconfig-paths';

// Register the paths from tsconfig.json
register({
  baseUrl: '.',
  paths: {
    '@/*': ['src/*']
  }
}); 