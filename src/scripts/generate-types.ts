#!/usr/bin/env ts-node

import { builderAdminApi } from '@/builder/admin-api';
import { typeScriptGenerator } from '@/types/generator';
import logger from '@/utils/logger';
import { validateConfig } from '@/utils/config';

interface GenerateTypesOptions {
  models?: string[];
  outputDir?: string;
  verbose?: boolean;
}

/**
 * CLI script to generate TypeScript interfaces from Builder.io models
 */
async function generateTypes(options: GenerateTypesOptions = {}) {
  try {
    // Validate configuration
    validateConfig();

    logger.info('Starting TypeScript interface generation');

    // Fetch models
    let models;
    if (options.models && options.models.length > 0) {
      logger.info(`Generating types for specific models: ${options.models.join(', ')}`);
      models = [];
      for (const modelId of options.models) {
        try {
          const model = await builderAdminApi.getModel(modelId);
          models.push(model);
        } catch (error) {
          logger.error(`Failed to fetch model ${modelId}:`, error);
          process.exit(1);
        }
      }
    } else {
      logger.info('Generating types for all models');
      models = await builderAdminApi.getModels({ includeFields: true });
    }

    if (models.length === 0) {
      logger.warn('No models found to generate types for');
      return;
    }

    // Generate TypeScript interfaces
    const generatedTypes = await typeScriptGenerator.generateAllTypes(models);

    logger.info(`✅ Successfully generated TypeScript interfaces for ${generatedTypes.length} models`);

    if (options.verbose) {
      generatedTypes.forEach(typeInfo => {
        logger.info(`  📄 ${typeInfo.interfaceName} -> ${typeInfo.filePath}`);
      });
    }

    logger.info(`📁 Output directory: ${typeScriptGenerator['outputDir']}`);

  } catch (error) {
    logger.error('Failed to generate TypeScript interfaces:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: GenerateTypesOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--models':
      case '-m':
        const modelsArg = args[++i];
        if (modelsArg) {
          options.models = modelsArg.split(',').map(m => m.trim());
        }
        break;
      
      case '--output':
      case '-o':
        options.outputDir = args[++i];
        break;
      
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      
      case '--help':
      case '-h':
        console.log(`
Usage: npm run generate:types [options]

Options:
  -m, --models <ids>     Comma-separated list of model IDs to generate types for
  -o, --output <dir>     Output directory for generated types (default: generated/types)
  -v, --verbose          Show detailed output
  -h, --help             Show this help message

Examples:
  npm run generate:types                           # Generate types for all models
  npm run generate:types -m model1,model2         # Generate types for specific models
  npm run generate:types -o ./src/types           # Custom output directory
  npm run generate:types -v                       # Verbose output
        `);
        process.exit(0);
      
      default:
        logger.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  generateTypes(options);
}

export { generateTypes };
