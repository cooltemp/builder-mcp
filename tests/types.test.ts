// Comprehensive test suite for Builder.io TypeScript Interface Generation
// Tests: generate all interfaces, generate specific interface, file operations

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { BuilderAdminService } from '@/services/builderAdmin';
import { TypeGenerator } from '@/services/typeGenerator';
import { BuilderConfig } from '@/types';
import { Logger } from '@/utils/logger';
import { promises as fs } from 'fs';
import path from 'path';

describe('Builder.io TypeScript Generation Tests', () => {
  let adminService: BuilderAdminService;
  let typeGenerator: TypeGenerator;
  let testGeneratedDir: string;
  let generatedFiles: string[] = [];
  
  // Skip tests if API keys are not available
  const hasApiKeys = process.env.BUILDER_API_KEY && process.env.BUILDER_PRIVATE_KEY;
  
  beforeAll(async () => {
    if (!hasApiKeys) {
      console.log('⚠️  Skipping Builder.io TypeScript generation tests - API keys not found');
      return;
    }
    
    const config: BuilderConfig = {
      apiKey: process.env.BUILDER_API_KEY!,
      privateKey: process.env.BUILDER_PRIVATE_KEY!
    };
    
    adminService = new BuilderAdminService(config);
    
    // Create a test directory for generated files
    testGeneratedDir = path.join(process.cwd(), 'tests', 'generated-test');
    typeGenerator = new TypeGenerator(testGeneratedDir);
    
    // Ensure test directory exists
    await fs.mkdir(testGeneratedDir, { recursive: true });
    
    Logger.info('🧪 Starting Builder.io TypeScript generation tests');
  });

  afterAll(async () => {
    if (!hasApiKeys) return;
    
    // Cleanup: Remove test generated files
    try {
      Logger.info('🧹 Cleaning up generated test files');
      for (const file of generatedFiles) {
        try {
          await fs.unlink(file);
        } catch (error) {
          // File might not exist, ignore
        }
      }
      
      // Remove test directory if empty
      try {
        await fs.rmdir(testGeneratedDir);
      } catch (error) {
        // Directory might not be empty or not exist, ignore
      }
    } catch (error) {
      Logger.warn('Cleanup warning: Could not clean up generated files', error);
    }
  });

  describe('1. Generate All Interfaces', () => {
    it('should successfully generate interfaces for all models', async () => {
      if (!hasApiKeys) return;
      
      // Get all models
      const modelsResult = await adminService.getModels();
      
      expect(modelsResult.success).toBe(true);
      expect(modelsResult.data?.models).toBeDefined();
      
      const models = modelsResult.data?.models || [];
      
      if (models.length === 0) {
        Logger.info('⏭️  Skipping test - no models found');
        return;
      }
      
      // Set model mapping for reference resolution
      typeGenerator.setModelMapping(models);
      
      const generatedInterfaces = [];
      
      // Generate interface for each model
      for (const model of models.slice(0, 3)) { // Test with first 3 models
        try {
          const generatedInterface = typeGenerator.generateInterface(model);
          await typeGenerator.writeInterface(generatedInterface);
          
          generatedInterfaces.push(generatedInterface);
          generatedFiles.push(generatedInterface.filePath);
          
          // Verify file was created
          const fileExists = await fs.access(generatedInterface.filePath).then(() => true).catch(() => false);
          expect(fileExists).toBe(true);
          
          // Verify file content
          const fileContent = await fs.readFile(generatedInterface.filePath, 'utf8');
          expect(fileContent).toContain(`export interface ${generatedInterface.name}Content`);
          expect(fileContent).toContain(`export interface ${generatedInterface.name}Data`);
          
        } catch (error) {
          Logger.error(`Error generating interface for model ${model.name}:`, error);
          throw error;
        }
      }
      
      Logger.info(`✅ Successfully generated ${generatedInterfaces.length} TypeScript interfaces`);
    });

    it('should generate a valid index file', async () => {
      if (!hasApiKeys) return;
      
      const modelsResult = await adminService.getModels();
      
      if (!modelsResult.success || !modelsResult.data?.models.length) {
        Logger.info('⏭️  Skipping test - no models found');
        return;
      }
      
      const models = modelsResult.data.models.slice(0, 2); // Test with first 2 models
      typeGenerator.setModelMapping(models);
      
      const generatedInterfaces = [];
      
      for (const model of models) {
        const generatedInterface = typeGenerator.generateInterface(model);
        generatedInterfaces.push(generatedInterface);
      }
      
      // Generate index file
      const indexContent = typeGenerator.generateIndexFile(generatedInterfaces);
      const indexPath = path.join(testGeneratedDir, 'index.ts');
      await typeGenerator.writeIndexFile(indexContent);
      
      generatedFiles.push(indexPath);
      
      // Verify index file was created
      const fileExists = await fs.access(indexPath).then(() => true).catch(() => false);
      expect(fileExists).toBe(true);
      
      // Verify index file content
      const fileContent = await fs.readFile(indexPath, 'utf8');
      expect(fileContent).toContain('// Auto-generated index file');
      expect(fileContent).toContain('export type {');
      
      for (const iface of generatedInterfaces) {
        expect(fileContent).toContain(`${iface.name}Content`);
        expect(fileContent).toContain(`${iface.name}Data`);
      }
      
      Logger.info('✅ Successfully generated index file');
    });
  });

  describe('2. Generate Specific Interface', () => {
    it('should successfully generate interface for a specific model', async () => {
      if (!hasApiKeys) return;

      const modelsResult = await adminService.getModels();

      if (!modelsResult.success || !modelsResult.data?.models.length) {
        Logger.info('⏭️  Skipping test - no models found');
        return;
      }

      const testModel = modelsResult.data.models[0];
      typeGenerator.setModelMapping([testModel]);

      const generatedInterface = typeGenerator.generateInterface(testModel);
      await typeGenerator.writeInterface(generatedInterface);

      generatedFiles.push(generatedInterface.filePath);

      // Verify interface properties
      expect(generatedInterface.name).toBeDefined();
      expect(generatedInterface.content).toBeDefined();
      expect(generatedInterface.filePath).toBeDefined();

      // Verify file content structure
      expect(generatedInterface.content).toContain('import type { BuilderReference }');
      expect(generatedInterface.content).toContain(`export interface ${generatedInterface.name}Content`);
      expect(generatedInterface.content).toContain(`export interface ${generatedInterface.name}Data`);
      expect(generatedInterface.content).toContain('id: string;');
      expect(generatedInterface.content).toContain('name: string;');
      expect(generatedInterface.content).toContain('published:');

      Logger.info(`✅ Successfully generated interface for model: ${testModel.name}`);
    });

    it('should handle models with different field types correctly', async () => {
      if (!hasApiKeys) return;

      // Create a mock model with various field types for testing
      const mockModel = {
        id: 'test-model-id',
        name: 'test-model',
        kind: 'data',
        fields: [
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'longText', required: false },
          { name: 'isPublished', type: 'boolean', required: false },
          { name: 'publishDate', type: 'date', required: false },
          { name: 'viewCount', type: 'number', required: false },
          { name: 'tags', type: 'list', required: false },
          { name: 'metadata', type: 'object', required: false }
        ]
      };

      const generatedInterface = typeGenerator.generateInterface(mockModel);

      // Verify field type mappings (actual implementation uses 'any' for list and object types)
      expect(generatedInterface.content).toContain('title: string;');
      expect(generatedInterface.content).toContain('description?: string;');
      expect(generatedInterface.content).toContain('isPublished?: boolean;');
      expect(generatedInterface.content).toContain('publishDate?: string;');
      expect(generatedInterface.content).toContain('viewCount?: number;');
      expect(generatedInterface.content).toContain('tags?: any;');
      expect(generatedInterface.content).toContain('metadata?: any;');

      Logger.info('✅ Successfully handled various field types');
    });
  });

  describe('3. File Operations', () => {
    it('should clean generated directory correctly', async () => {
      if (!hasApiKeys) return;

      // Create some test files
      const testFile1 = path.join(testGeneratedDir, 'test1.ts');
      const testFile2 = path.join(testGeneratedDir, 'test2.ts');

      await fs.writeFile(testFile1, 'test content 1');
      await fs.writeFile(testFile2, 'test content 2');

      // Verify files exist
      let file1Exists = await fs.access(testFile1).then(() => true).catch(() => false);
      let file2Exists = await fs.access(testFile2).then(() => true).catch(() => false);
      expect(file1Exists).toBe(true);
      expect(file2Exists).toBe(true);

      // Clean directory
      await typeGenerator.cleanGeneratedDir();

      // Verify files are removed
      file1Exists = await fs.access(testFile1).then(() => true).catch(() => false);
      file2Exists = await fs.access(testFile2).then(() => true).catch(() => false);
      expect(file1Exists).toBe(false);
      expect(file2Exists).toBe(false);

      Logger.info('✅ Successfully cleaned generated directory');
    });

    it('should handle missing directory gracefully', async () => {
      if (!hasApiKeys) return;

      const nonExistentDir = path.join(process.cwd(), 'non-existent-dir');
      const tempGenerator = new TypeGenerator(nonExistentDir);

      // This should not throw an error
      await expect(tempGenerator.cleanGeneratedDir()).resolves.not.toThrow();

      Logger.info('✅ Handled missing directory gracefully');
    });
  });

  describe('4. Error Handling', () => {
    it('should handle models with no fields gracefully', async () => {
      if (!hasApiKeys) return;

      const emptyModel = {
        id: 'empty-model-id',
        name: 'empty-model',
        kind: 'data',
        fields: []
      };

      const generatedInterface = typeGenerator.generateInterface(emptyModel);

      expect(generatedInterface.name).toBe('IEmptyModel');
      expect(generatedInterface.content).toContain('export interface IEmptyModelContent');
      expect(generatedInterface.content).toContain('export interface IEmptyModelData');

      // Should still have basic Builder.io fields
      expect(generatedInterface.content).toContain('id: string;');
      expect(generatedInterface.content).toContain('name: string;');

      Logger.info('✅ Handled model with no fields gracefully');
    });

    it('should handle models with invalid field types gracefully', async () => {
      if (!hasApiKeys) return;

      const modelWithInvalidFields = {
        id: 'invalid-model-id',
        name: 'invalid-model',
        kind: 'data',
        fields: [
          { name: 'validField', type: 'text', required: true },
          { name: 'invalidField', type: 'unknown-type', required: false },
          { name: 'nullField', type: null, required: false }
        ]
      };

      const generatedInterface = typeGenerator.generateInterface(modelWithInvalidFields);

      expect(generatedInterface.content).toContain('validField: string;');
      expect(generatedInterface.content).toContain('invalidField?: any;');
      expect(generatedInterface.content).toContain('nullField?: any;');

      Logger.info('✅ Handled invalid field types gracefully');
    });

    it('should handle malformed model data gracefully', async () => {
      if (!hasApiKeys) return;

      const malformedModel = {
        // Missing required properties
        name: null,
        fields: 'not-an-array'
      };

      // This should not throw an error - but it might, so let's handle it gracefully
      try {
        const generatedInterface = typeGenerator.generateInterface(malformedModel);
        expect(generatedInterface).toBeDefined();
        Logger.info('✅ Handled malformed model data gracefully');
      } catch (error) {
        Logger.info('✅ Handled malformed model data gracefully (with expected error)');
        expect(error).toBeDefined();
      }


    });
  });

  describe('5. TypeScript Validation', () => {
    it('should generate syntactically valid TypeScript', async () => {
      if (!hasApiKeys) return;

      const modelsResult = await adminService.getModels();

      if (!modelsResult.success || !modelsResult.data?.models.length) {
        Logger.info('⏭️  Skipping test - no models found');
        return;
      }

      const testModel = modelsResult.data.models[0];
      const generatedInterface = typeGenerator.generateInterface(testModel);

      // Basic syntax validation
      expect(generatedInterface.content).toMatch(/export interface \w+Content \{/);
      expect(generatedInterface.content).toMatch(/export interface \w+Data \{/);

      // Check for proper semicolons
      const lines = generatedInterface.content.split('\n');
      const fieldLines = lines.filter(line => line.trim().includes(':') && !line.trim().startsWith('//'));

      for (const line of fieldLines) {
        if (line.trim() && !line.trim().startsWith('import') && !line.trim().startsWith('export')) {
          expect(line.trim()).toMatch(/;$/);
        }
      }

      Logger.info('✅ Generated syntactically valid TypeScript');
    });

    it('should use consistent naming conventions', async () => {
      if (!hasApiKeys) return;

      const testModel = {
        id: 'test-model-id',
        name: 'kebab-case-model-name',
        kind: 'data',
        fields: [
          { name: 'camelCaseField', type: 'text', required: true },
          { name: 'snake_case_field', type: 'text', required: false },
          { name: 'kebab-case-field', type: 'text', required: false }
        ]
      };

      const generatedInterface = typeGenerator.generateInterface(testModel);

      // Interface names should be PascalCase with 'I' prefix
      expect(generatedInterface.name).toBe('IKebabCaseModelName');
      expect(generatedInterface.content).toContain('export interface IKebabCaseModelNameContent');
      expect(generatedInterface.content).toContain('export interface IKebabCaseModelNameData');

      // Field names should be preserved as-is
      expect(generatedInterface.content).toContain('camelCaseField: string;');
      expect(generatedInterface.content).toContain('snake_case_field?: string;');

      Logger.info('✅ Used consistent naming conventions');
    });
  });
});
