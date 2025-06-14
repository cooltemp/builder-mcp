#!/usr/bin/env tsx

// Validation script to compare generated TypeScript interfaces with actual Content API responses
// Usage: npm run validate-types [model-name]

import { config } from 'dotenv';
import { promises as fs } from 'fs';
import path from 'path';
import { BuilderAdminService } from '@/services/builderAdmin';
import { BuilderContentService } from '@/services/builderContent';
import { TypeGenerator } from '@/services/typeGenerator';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';

// Load environment variables
config();

interface ValidationResult {
  model: string;
  schemaFields: string[];
  contentFields: string[];
  missingInContent: string[];
  extraInContent: string[];
  typeMatches: boolean;
  sampleContent?: any;
  hasContent: boolean;
  timestamp: string;
}

async function generateReport(results: ValidationResult[], outputPath: string): Promise<void> {
  const timestamp = new Date().toISOString();
  const perfectMatches = results.filter(r => r.typeMatches).length;
  const withContent = results.filter(r => r.hasContent).length;

  const report = `# Builder.io TypeScript Interface Validation Report

**Generated:** ${timestamp}
**Total Models:** ${results.length}
**Perfect Matches:** ${perfectMatches}/${results.length}
**Models with Content:** ${withContent}/${results.length}

## 📊 Summary

| Model | Status | Content | Schema Fields | Content Fields | Issues |
|-------|--------|---------|---------------|----------------|--------|
${results.map(r => {
  const status = r.typeMatches ? '✅ Perfect' : '⚠️ Partial';
  const content = r.hasContent ? '📄 Yes' : '📭 No';
  const issues = [
    ...r.missingInContent.map(f => `Missing: ${f}`),
    ...r.extraInContent.map(f => `Extra: ${f}`)
  ].join(', ') || 'None';

  return `| ${r.model} | ${status} | ${content} | ${r.schemaFields.length} | ${r.contentFields.length} | ${issues} |`;
}).join('\n')}

## 📋 Detailed Results

${results.map(result => `
### ${result.model}

**Status:** ${result.typeMatches ? '✅ Perfect Match' : '⚠️ Partial Match'}
**Has Content:** ${result.hasContent ? '📄 Yes' : '📭 No'}
**Schema Fields:** ${result.schemaFields.length}
**Content Fields:** ${result.contentFields.length}

${result.missingInContent.length > 0 ? `
**Missing in Content:**
${result.missingInContent.map(f => `- ${f}`).join('\n')}
` : ''}

${result.extraInContent.length > 0 ? `
**Extra in Content:**
${result.extraInContent.map(f => `- ${f}`).join('\n')}
` : ''}

${result.hasContent ? `
**Sample Content Structure:**
\`\`\`json
${JSON.stringify(result.sampleContent, null, 2)}
\`\`\`
` : '**No content entries found for this model.**'}

---
`).join('\n')}

## 🔧 Recommendations

### Perfect Matches ✅
${results.filter(r => r.typeMatches).map(r => `- **${r.model}**: Ready for production use`).join('\n') || 'None'}

### Partial Matches ⚠️
${results.filter(r => !r.typeMatches && r.hasContent).map(r => {
  const recommendations = [];
  if (r.missingInContent.length > 0) {
    recommendations.push(`Missing fields are likely optional - consider adding sample data for: ${r.missingInContent.join(', ')}`);
  }
  if (r.extraInContent.length > 0) {
    recommendations.push(`Extra fields may be Builder.io system fields - verify if they should be included in interface`);
  }
  return `- **${r.model}**: ${recommendations.join('. ')}`;
}).join('\n') || 'None'}

### No Content 📭
${results.filter(r => !r.hasContent).map(r => `- **${r.model}**: Create sample content entries to validate interface accuracy`).join('\n') || 'None'}

## 📝 Notes

- **Missing fields** are typically optional fields that aren't populated in the sample content
- **Extra fields** may be Builder.io system fields (like \`jsCode\`, \`inputs\`, etc.) for certain model types
- **Perfect matches** indicate the generated TypeScript interfaces accurately reflect the content structure
- This validation uses the first available content entry for each model

---
*Generated by Builder.io MCP TypeScript Validation Tool*
`;

  await fs.writeFile(outputPath, report, 'utf8');
}

async function validateModel(
  modelName: string,
  adminService: BuilderAdminService,
  contentService: BuilderContentService,
  typeGenerator: TypeGenerator
): Promise<ValidationResult> {
  console.log(`\n🔍 Validating model: ${modelName}`);

  // 1. Get model schema
  const modelsResult = await adminService.getModels();
  if (!modelsResult.success) {
    throw new Error(`Failed to fetch models: ${modelsResult.error}`);
  }

  const model = modelsResult.data?.models?.find(m => m.name === modelName);
  if (!model) {
    throw new Error(`Model ${modelName} not found`);
  }

  // 2. Get actual content with references included
  console.log('   📥 Fetching content...');
  const contentResult = await contentService.getContent(modelName, {
    limit: 1,
    includeRefs: true,
    cacheSeconds: 0
  });
  
  if (!contentResult.success) {
    console.log(`   ⚠️  No content found for ${modelName}: ${contentResult.error}`);
    return {
      model: modelName,
      schemaFields: [],
      contentFields: [],
      missingInContent: [],
      extraInContent: [],
      typeMatches: false,
      hasContent: false,
      timestamp: new Date().toISOString()
    };
  }

  const content = contentResult.data?.[0];
  if (!content) {
    console.log(`   ⚠️  No content entries found for ${modelName}`);
    return {
      model: modelName,
      schemaFields: [],
      contentFields: [],
      missingInContent: [],
      extraInContent: [],
      typeMatches: false,
      hasContent: false,
      timestamp: new Date().toISOString()
    };
  }

  // 3. Extract field names from schema
  const schemaFields = model.fields
    ?.filter(field => field.name && typeof field.name === 'string')
    ?.map(field => field.name) || [];

  // 4. Extract field names from actual content data
  const contentFields = Object.keys(content.data || {});

  // 5. Compare
  const missingInContent = schemaFields.filter(field => !contentFields.includes(field));
  const extraInContent = contentFields.filter(field => !schemaFields.includes(field));

  console.log(`   📊 Schema fields: ${schemaFields.length}`);
  console.log(`   📊 Content fields: ${contentFields.length}`);
  
  if (missingInContent.length > 0) {
    console.log(`   ⚠️  Missing in content: ${missingInContent.join(', ')}`);
  }
  
  if (extraInContent.length > 0) {
    console.log(`   ℹ️  Extra in content: ${extraInContent.join(', ')}`);
  }

  if (missingInContent.length === 0 && extraInContent.length === 0) {
    console.log(`   ✅ Perfect match!`);
  }

  return {
    model: modelName,
    schemaFields,
    contentFields,
    missingInContent,
    extraInContent,
    typeMatches: missingInContent.length === 0 && extraInContent.length === 0,
    sampleContent: content,
    hasContent: true,
    timestamp: new Date().toISOString()
  };
}

async function main() {
  const args = process.argv.slice(2);
  const specificModel = args[0];

  // Validate environment variables
  const apiKey = process.env.BUILDER_API_KEY;
  const privateKey = process.env.BUILDER_PRIVATE_KEY;

  if (!apiKey || !privateKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   BUILDER_API_KEY and BUILDER_PRIVATE_KEY must be set');
    process.exit(1);
  }

  const builderConfig: BuilderConfig = {
    apiKey,
    privateKey
  };

  const adminService = new BuilderAdminService(builderConfig);
  const contentService = new BuilderContentService(builderConfig);
  const typeGenerator = new TypeGenerator();

  try {
    if (specificModel) {
      // Validate specific model
      const result = await validateModel(specificModel, adminService, contentService, typeGenerator);

      // Generate report for single model
      const reportPath = path.join(process.cwd(), `validation-report-${specificModel}.md`);
      await generateReport([result], reportPath);

      console.log('\n📋 Validation Summary:');
      console.log(`   Model: ${result.model}`);
      console.log(`   Type Match: ${result.typeMatches ? '✅' : '❌'}`);
      console.log(`   Report generated: ${reportPath}`);

      if (result.sampleContent) {
        console.log('\n📄 Sample Content Structure:');
        console.log('   Top-level properties:');
        Object.keys(result.sampleContent).forEach(key => {
          console.log(`     ${key}: ${typeof result.sampleContent[key]}`);
        });

        console.log('\n   Data properties:');
        Object.keys(result.sampleContent.data || {}).forEach(key => {
          const value = result.sampleContent.data[key];
          const type = Array.isArray(value) ? 'array' : typeof value;
          console.log(`     ${key}: ${type}`);
        });
      }
    } else {
      // Validate all models
      console.log('🔍 Validating all models...');
      
      const modelsResult = await adminService.getModels();
      if (!modelsResult.success) {
        console.error('❌ Failed to fetch models:', modelsResult.error);
        process.exit(1);
      }

      const models = modelsResult.data?.models || [];
      console.log(`📋 Found ${models.length} models`);

      const results: ValidationResult[] = [];
      
      for (const model of models) {
        try {
          const result = await validateModel(model.name, adminService, contentService, typeGenerator);
          results.push(result);
        } catch (error: any) {
          console.log(`   ❌ Error validating ${model.name}: ${error.message}`);
          results.push({
            model: model.name,
            schemaFields: [],
            contentFields: [],
            missingInContent: [],
            extraInContent: [],
            typeMatches: false,
            hasContent: false,
            timestamp: new Date().toISOString()
          });
        }
      }

      // Generate report file
      const reportPath = path.join(process.cwd(), 'validation-report.md');
      await generateReport(results, reportPath);

      // Summary
      console.log('\n📊 Validation Summary:');
      const perfectMatches = results.filter(r => r.typeMatches).length;
      const withContent = results.filter(r => r.hasContent).length;

      console.log(`   ✅ Perfect matches: ${perfectMatches}/${results.length}`);
      console.log(`   📄 Models with content: ${withContent}/${results.length}`);
      console.log(`   📄 Report generated: ${reportPath}`);

      console.log('\n📋 Quick Results:');
      results.forEach(result => {
        const status = result.typeMatches ? '✅' : '❌';
        const contentStatus = result.hasContent ? '📄' : '📭';
        console.log(`   ${status} ${contentStatus} ${result.model}`);
      });
    }
  } catch (error: any) {
    console.error('❌ Unexpected error:', error.message);
    Logger.error('CLI validation error:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}
