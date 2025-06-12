import { builderAdminApi } from '@/builder/admin-api';
import { builderContentApi } from '@/builder/content-api';
import { frontendFileMapper, FrontendFileMap } from './file-mapper';
import { typeScriptGenerator } from '@/types/generator';
import { BuilderModel, BuilderContent, GeneratedTypeInfo } from '@/builder/types';
import logger from '@/utils/logger';
import fs from 'fs';
import path from 'path';

export interface AugmentContext {
  metadata: {
    generatedAt: string;
    version: string;
    builderApiKeys: {
      hasPublicKey: boolean;
      hasPrivateKey: boolean;
    };
  };
  models: {
    count: number;
    items: BuilderModel[];
    byId: Record<string, BuilderModel>;
    byName: Record<string, BuilderModel>;
  };
  content: {
    totalEntries: number;
    byModel: Record<string, {
      count: number;
      published: number;
      draft: number;
      samples: BuilderContent[];
    }>;
  };
  types: {
    hasGenerated: boolean;
    count: number;
    items: GeneratedTypeInfo[];
    outputDirectory: string;
  };
  frontend: {
    hasPath: boolean;
    fileMap?: FrontendFileMap;
    keyFiles: {
      packageJson?: any;
      tsConfig?: any;
      nextConfig?: any;
      viteConfig?: any;
    };
  };
  relationships: {
    modelContentCounts: Record<string, number>;
    referencedModels: Record<string, string[]>;
    unusedModels: string[];
  };
  suggestions: {
    missingTypes: string[];
    outdatedContent: string[];
    optimizations: string[];
  };
}

export class AugmentContextProvider {
  /**
   * Generate comprehensive context for Augment AI
   */
  async generateContext(): Promise<AugmentContext> {
    logger.info('Generating Augment context');

    const startTime = Date.now();

    try {
      // Fetch all data in parallel where possible
      const [models, frontendFileMap, generatedTypes] = await Promise.all([
        this.fetchModels(),
        this.fetchFrontendFileMap(),
        this.fetchGeneratedTypes(),
      ]);

      // Fetch content for each model
      const content = await this.fetchContentByModel(models);

      // Analyze relationships and generate suggestions
      const relationships = this.analyzeRelationships(models, content);
      const suggestions = this.generateSuggestions(models, content, generatedTypes, frontendFileMap);

      const context: AugmentContext = {
        metadata: {
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
          builderApiKeys: {
            hasPublicKey: !!process.env['BUILDER_PUBLIC_API_KEY'],
            hasPrivateKey: !!process.env['BUILDER_PRIVATE_API_KEY'],
          },
        },
        models: {
          count: models.length,
          items: models,
          byId: models.reduce((acc, model) => {
            acc[model.id] = model;
            return acc;
          }, {} as Record<string, BuilderModel>),
          byName: models.reduce((acc, model) => {
            acc[model.name] = model;
            return acc;
          }, {} as Record<string, BuilderModel>),
        },
        content,
        types: {
          hasGenerated: generatedTypes.length > 0,
          count: generatedTypes.length,
          items: generatedTypes,
          outputDirectory: typeScriptGenerator['outputDir'],
        },
        frontend: {
          hasPath: !!frontendFileMap,
          fileMap: frontendFileMap,
          keyFiles: frontendFileMap ? await this.extractKeyFiles(frontendFileMap) : {},
        },
        relationships,
        suggestions,
      };

      const duration = Date.now() - startTime;
      logger.info('Augment context generated successfully', { 
        duration: `${duration}ms`,
        modelsCount: models.length,
        contentEntries: content.totalEntries,
        typesGenerated: generatedTypes.length,
        hasFrontendMap: !!frontendFileMap,
      });

      return context;
    } catch (error) {
      logger.error('Failed to generate Augment context', error);
      throw error;
    }
  }

  /**
   * Fetch all Builder.io models
   */
  private async fetchModels(): Promise<BuilderModel[]> {
    try {
      return await builderAdminApi.getModels({ includeFields: true });
    } catch (error) {
      logger.warn('Failed to fetch models for Augment context', error);
      return [];
    }
  }

  /**
   * Fetch frontend file map
   */
  private async fetchFrontendFileMap(): Promise<FrontendFileMap | undefined> {
    try {
      return await frontendFileMapper.generateFileMap();
    } catch (error) {
      logger.warn('Failed to generate frontend file map for Augment context', error);
      return undefined;
    }
  }

  /**
   * Fetch generated TypeScript types
   */
  private async fetchGeneratedTypes(): Promise<GeneratedTypeInfo[]> {
    try {
      const outputDir = typeScriptGenerator['outputDir'];
      if (!fs.existsSync(outputDir)) {
        return [];
      }

      const indexPath = path.join(outputDir, 'index.ts');
      if (!fs.existsSync(indexPath)) {
        return [];
      }

      // Try to read generated types info from index file
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      const match = indexContent.match(/export const generatedTypes = (.*?);/s);
      
      if (match && match[1]) {
        return JSON.parse(match[1]);
      }

      return [];
    } catch (error) {
      logger.warn('Failed to fetch generated types for Augment context', error);
      return [];
    }
  }

  /**
   * Fetch content for each model
   */
  private async fetchContentByModel(models: BuilderModel[]): Promise<AugmentContext['content']> {
    const byModel: Record<string, any> = {};
    let totalEntries = 0;

    for (const model of models) {
      try {
        const allContent = await builderContentApi.getContent(model.id, { limit: 1000 });
        const published = allContent.filter(c => c.published === 'published').length;
        const draft = allContent.filter(c => c.published === 'draft').length;
        
        // Get sample content (first 3 entries)
        const samples = allContent.slice(0, 3);

        byModel[model.id] = {
          count: allContent.length,
          published,
          draft,
          samples,
        };

        totalEntries += allContent.length;
      } catch (error) {
        logger.warn(`Failed to fetch content for model ${model.id}`, error);
        byModel[model.id] = {
          count: 0,
          published: 0,
          draft: 0,
          samples: [],
        };
      }
    }

    return {
      totalEntries,
      byModel,
    };
  }

  /**
   * Analyze relationships between models and content
   */
  private analyzeRelationships(
    models: BuilderModel[], 
    content: AugmentContext['content']
  ): AugmentContext['relationships'] {
    const modelContentCounts: Record<string, number> = {};
    const referencedModels: Record<string, string[]> = {};
    const unusedModels: string[] = [];

    for (const model of models) {
      const contentCount = content.byModel[model.id]?.count || 0;
      modelContentCounts[model.id] = contentCount;

      if (contentCount === 0) {
        unusedModels.push(model.id);
      }

      // Find reference fields
      const references = model.fields
        .filter(field => field.type === 'reference' && field.model)
        .map(field => field.model!)
        .filter(Boolean);

      if (references.length > 0) {
        referencedModels[model.id] = references;
      }
    }

    return {
      modelContentCounts,
      referencedModels,
      unusedModels,
    };
  }

  /**
   * Generate suggestions for optimization and improvements
   */
  private generateSuggestions(
    models: BuilderModel[],
    content: AugmentContext['content'],
    generatedTypes: GeneratedTypeInfo[],
    frontendFileMap?: FrontendFileMap
  ): AugmentContext['suggestions'] {
    const missingTypes: string[] = [];
    const outdatedContent: string[] = [];
    const optimizations: string[] = [];

    // Check for missing TypeScript types
    const generatedModelIds = new Set(generatedTypes.map(t => t.modelId));
    for (const model of models) {
      if (!generatedModelIds.has(model.id)) {
        missingTypes.push(model.name);
      }
    }

    // Check for outdated content
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    for (const model of models) {
      const modelContent = content.byModel[model.id];
      if (modelContent && modelContent.samples.length > 0) {
        const hasOldContent = modelContent.samples.some(
          c => c.lastUpdated < oneWeekAgo
        );
        if (hasOldContent) {
          outdatedContent.push(model.name);
        }
      }
    }

    // Generate optimization suggestions
    if (models.length > 10) {
      optimizations.push('Consider organizing models into categories or namespaces');
    }

    if (content.totalEntries > 1000) {
      optimizations.push('Consider implementing content archiving for old entries');
    }

    if (frontendFileMap && frontendFileMap.summary.totalFiles > 500) {
      optimizations.push('Large frontend codebase detected - consider code splitting');
    }

    const unusedModelCount = models.filter(m => 
      (content.byModel[m.id]?.count || 0) === 0
    ).length;
    
    if (unusedModelCount > 0) {
      optimizations.push(`${unusedModelCount} models have no content - consider removing or populating them`);
    }

    return {
      missingTypes,
      outdatedContent,
      optimizations,
    };
  }

  /**
   * Extract key configuration files from frontend
   */
  private async extractKeyFiles(fileMap: FrontendFileMap): Promise<AugmentContext['frontend']['keyFiles']> {
    const keyFiles: AugmentContext['frontend']['keyFiles'] = {};

    try {
      // Find key configuration files
      const configFiles = fileMap.configs;
      
      const packageJsonFile = configFiles.find(f => f.name === 'package.json');
      if (packageJsonFile) {
        const content = fs.readFileSync(packageJsonFile.path, 'utf8');
        keyFiles.packageJson = JSON.parse(content);
      }

      const tsConfigFile = configFiles.find(f => f.name.includes('tsconfig'));
      if (tsConfigFile) {
        const content = fs.readFileSync(tsConfigFile.path, 'utf8');
        keyFiles.tsConfig = JSON.parse(content);
      }

      const nextConfigFile = configFiles.find(f => f.name.includes('next.config'));
      if (nextConfigFile) {
        keyFiles.nextConfig = { path: nextConfigFile.path };
      }

      const viteConfigFile = configFiles.find(f => f.name.includes('vite.config'));
      if (viteConfigFile) {
        keyFiles.viteConfig = { path: viteConfigFile.path };
      }
    } catch (error) {
      logger.warn('Failed to extract key files from frontend', error);
    }

    return keyFiles;
  }

  /**
   * Get context for specific models only
   */
  async getModelContext(modelIds: string[]): Promise<Partial<AugmentContext>> {
    const models = [];
    
    for (const modelId of modelIds) {
      try {
        const model = await builderAdminApi.getModel(modelId);
        models.push(model);
      } catch (error) {
        logger.warn(`Failed to fetch model ${modelId} for context`, error);
      }
    }

    const content = await this.fetchContentByModel(models);
    const relationships = this.analyzeRelationships(models, content);

    return {
      models: {
        count: models.length,
        items: models,
        byId: models.reduce((acc, model) => {
          acc[model.id] = model;
          return acc;
        }, {} as Record<string, BuilderModel>),
        byName: models.reduce((acc, model) => {
          acc[model.name] = model;
          return acc;
        }, {} as Record<string, BuilderModel>),
      },
      content,
      relationships,
    };
  }
}

// Export singleton instance
export const augmentContextProvider = new AugmentContextProvider();
