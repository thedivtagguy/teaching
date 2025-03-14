#!/usr/bin/env node

/**
 * Script to generate menu.yaml from content files
 * Run: node --experimental-specifier-resolution=node scripts/generate-menu.js
 */

// For ES modules, we need to handle paths correctly
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Calculate the project root directory
// If this script is run directly with node
const __dirname = process.cwd();

// Import function to generate menu
const menuGeneratorPath = resolve(__dirname, 'src/lib/utils/menuGenerator.js');

// Load the menu generator module dynamically
try {
  const { generateMenuConfig } = await import(`file://${menuGeneratorPath}`);
  console.log('Generating menu configuration from content files...');
  
  const menuData = await generateMenuConfig();
  
  // Write the data to the menu.yaml file
  const configDir = resolve(__dirname, 'src/config');
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true });
  }
  
  const configPath = resolve(configDir, 'menu.yaml');
  
  // We need to import yaml dynamically too
  const yaml = await import('js-yaml');
  const yamlContent = yaml.dump(menuData, { lineWidth: 100 });
  
  fs.writeFileSync(configPath, yamlContent, 'utf8');
  console.log('Menu configuration generated successfully at:', configPath);
  process.exit(0);
} catch (error) {
  console.error('Error generating menu configuration:', error);
  process.exit(1);
} 