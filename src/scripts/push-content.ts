#!/usr/bin/env ts-node

import fs from 'fs';
import path from 'path';
import { builderContentApi } from '@/builder/content-api';
import { builderAdminApi } from '@/builder/admin-api';
import logger from '@/utils/logger';
import { validateConfig } from '@/utils/config';

interface PushContentOptions {
  file?: string;
  model?: string;
  publish?: boolean;
  dryRun?: boolean;
  verbose?: boolean;
}

interface ContentEntry {
  name: string;
  data: Record<string, any>;
  published?: 'draft' | 'published';
  meta?: {
    urlPath?: string;
    title?: string;
    description?: string;
  };
}

/**
 * CLI script to push content to Builder.io from JSON files
 */
async function pushContent(options: PushContentOptions = {}) {
  try {
    // Validate configuration
    validateConfig();

    logger.info('Starting content push to Builder.io');

    if (!options.file) {
      logger.error('Content file is required. Use --file option.');
      process.exit(1);
    }

    if (!options.model) {
      logger.error('Model ID is required. Use --model option.');
      process.exit(1);
    }

    // Verify model exists
    try {
      const model = await builderAdminApi.getModel(options.model);
      logger.info(`Target model: ${model.name} (${model.id})`);
    } catch (error) {
      logger.error(`Model ${options.model} not found`);
      process.exit(1);
    }

    // Read content file
    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
      logger.error(`Content file not found: ${filePath}`);
      process.exit(1);
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    let contentEntries: ContentEntry[];

    try {
      const parsed = JSON.parse(fileContent);
      contentEntries = Array.isArray(parsed) ? parsed : [parsed];
    } catch (error) {
      logger.error('Invalid JSON in content file:', error);
      process.exit(1);
    }

    if (contentEntries.length === 0) {
      logger.warn('No content entries found in file');
      return;
    }

    logger.info(`Found ${contentEntries.length} content entries to push`);

    if (options.dryRun) {
      logger.info('🔍 DRY RUN MODE - No actual changes will be made');
    }

    const results = [];
    const errors = [];

    for (let i = 0; i < contentEntries.length; i++) {
      const entry = contentEntries[i];
      
      try {
        if (options.verbose) {
          logger.info(`Processing entry ${i + 1}/${contentEntries.length}: ${entry.name}`);
        }

        // Validate entry
        if (!entry.name || !entry.data) {
          throw new Error('Entry must have name and data properties');
        }

        // Set publish status
        const publishStatus = options.publish ? 'published' : (entry.published || 'draft');
        const contentData = {
          ...entry,
          published: publishStatus,
        };

        if (!options.dryRun) {
          const result = await builderContentApi.createContent(options.model!, contentData);
          results.push({
            index: i,
            name: entry.name,
            id: result.id,
            status: 'created',
          });

          if (options.verbose) {
            logger.info(`✅ Created: ${entry.name} (${result.id})`);
          }
        } else {
          results.push({
            index: i,
            name: entry.name,
            status: 'would-create',
          });

          if (options.verbose) {
            logger.info(`✅ Would create: ${entry.name}`);
          }
        }

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push({
          index: i,
          name: entry.name,
          error: errorMessage,
        });

        logger.error(`❌ Failed to process ${entry.name}: ${errorMessage}`);
      }
    }

    // Summary
    logger.info('\n📊 Push Summary:');
    logger.info(`  Total entries: ${contentEntries.length}`);
    logger.info(`  Successful: ${results.length}`);
    logger.info(`  Failed: ${errors.length}`);

    if (options.dryRun) {
      logger.info('  Mode: DRY RUN (no changes made)');
    } else {
      logger.info(`  Published: ${results.filter(r => r.status === 'created').length}`);
    }

    if (errors.length > 0) {
      logger.info('\n❌ Errors:');
      errors.forEach(error => {
        logger.info(`  ${error.name}: ${error.error}`);
      });
    }

    if (options.verbose && results.length > 0) {
      logger.info('\n✅ Successful entries:');
      results.forEach(result => {
        const status = result.status === 'created' ? `ID: ${result.id}` : 'DRY RUN';
        logger.info(`  ${result.name} (${status})`);
      });
    }

  } catch (error) {
    logger.error('Failed to push content:', error);
    process.exit(1);
  }
}

// CLI interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const options: PushContentOptions = {};

  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    
    switch (arg) {
      case '--file':
      case '-f':
        options.file = args[++i];
        break;
      
      case '--model':
      case '-m':
        options.model = args[++i];
        break;
      
      case '--publish':
      case '-p':
        options.publish = true;
        break;
      
      case '--dry-run':
      case '-d':
        options.dryRun = true;
        break;
      
      case '--verbose':
      case '-v':
        options.verbose = true;
        break;
      
      case '--help':
      case '-h':
        console.log(`
Usage: npm run push:content [options]

Options:
  -f, --file <path>      Path to JSON file containing content entries
  -m, --model <id>       Builder.io model ID to push content to
  -p, --publish          Publish content entries (default: draft)
  -d, --dry-run          Show what would be done without making changes
  -v, --verbose          Show detailed output
  -h, --help             Show this help message

Content File Format:
  Single entry:
  {
    "name": "My Content Entry",
    "data": { "title": "Hello", "description": "World" },
    "published": "draft",
    "meta": { "title": "SEO Title" }
  }

  Multiple entries:
  [
    { "name": "Entry 1", "data": { ... } },
    { "name": "Entry 2", "data": { ... } }
  ]

Examples:
  npm run push:content -f content.json -m my-model-id
  npm run push:content -f content.json -m my-model-id --publish
  npm run push:content -f content.json -m my-model-id --dry-run -v
        `);
        process.exit(0);
      
      default:
        logger.error(`Unknown argument: ${arg}`);
        process.exit(1);
    }
  }

  pushContent(options);
}

export { pushContent };
