// Type validation utilities to ensure MCP server never guesses Builder.io schemas
import { BuilderAdminService } from '@/services/builderAdmin';
import { TypeGenerator } from '@/services/typeGenerator';
import { Logger } from '@/utils/logger';
import { BuilderConfig } from '@/types';

export class TypeValidator {
  private adminService: BuilderAdminService;
  private typeGenerator: TypeGenerator;
  private schemaCache: Map<string, any> = new Map();
  private cacheExpiry: Map<string, number> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  constructor(config: BuilderConfig) {
    this.adminService = new BuilderAdminService(config);
    this.typeGenerator = new TypeGenerator();
  }

  /**
   * Validate content data against actual Builder.io model schema
   * This ensures we never guess field types or structures
   */
  async validateContentAgainstSchema(modelName: string, contentData: any): Promise<{
    valid: boolean;
    errors: string[];
    schema: any;
  }> {
    Logger.info(`Validating content against actual schema for model: ${modelName}`);

    // Get fresh schema from Builder.io
    const schema = await this.getModelSchema(modelName);
    const errors: string[] = [];

    // Validate each field in contentData against actual schema
    for (const [fieldName, fieldValue] of Object.entries(contentData)) {
      const schemaField = schema.fields?.find((f: any) => f.name === fieldName);
      
      if (!schemaField) {
        errors.push(`Field '${fieldName}' does not exist in model '${modelName}' schema`);
        continue;
      }

      // Validate field type matches schema
      const typeError = this.validateFieldType(fieldName, fieldValue, schemaField);
      if (typeError) {
        errors.push(typeError);
      }
    }

    // Check for required fields
    const requiredFields = schema.fields?.filter((f: any) => f.required) || [];
    for (const requiredField of requiredFields) {
      if (!(requiredField.name in contentData)) {
        errors.push(`Required field '${requiredField.name}' is missing`);
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      schema
    };
  }

  /**
   * Get model schema with caching to avoid excessive API calls
   */
  private async getModelSchema(modelName: string): Promise<any> {
    const now = Date.now();
    const cached = this.schemaCache.get(modelName);
    const expiry = this.cacheExpiry.get(modelName) || 0;

    if (cached && now < expiry) {
      Logger.debug(`Using cached schema for model: ${modelName}`);
      return cached;
    }

    Logger.info(`Fetching fresh schema from Builder.io for model: ${modelName}`);
    const result = await this.adminService.getModelByName(modelName);
    
    if (!result.success) {
      throw new Error(`Failed to fetch schema for model '${modelName}': ${result.error}`);
    }

    const schema = result.data;
    this.schemaCache.set(modelName, schema);
    this.cacheExpiry.set(modelName, now + this.CACHE_TTL);

    return schema;
  }

  /**
   * Validate individual field type against schema definition
   */
  private validateFieldType(fieldName: string, value: any, schemaField: any): string | null {
    if (value === null || value === undefined) {
      return schemaField.required ? `Required field '${fieldName}' cannot be null/undefined` : null;
    }

    const fieldType = schemaField.type;
    const actualType = typeof value;

    // Type mapping validation
    switch (fieldType) {
      case 'text':
      case 'longText':
      case 'richText':
      case 'html':
      case 'markdown':
      case 'select':
      case 'enum':
      case 'file':
      case 'image':
      case 'video':
      case 'color':
      case 'url':
      case 'email':
      case 'phone':
      case 'date':
      case 'datetime':
        if (actualType !== 'string') {
          return `Field '${fieldName}' should be string, got ${actualType}`;
        }
        break;

      case 'number':
        if (actualType !== 'number') {
          return `Field '${fieldName}' should be number, got ${actualType}`;
        }
        break;

      case 'boolean':
        if (actualType !== 'boolean') {
          return `Field '${fieldName}' should be boolean, got ${actualType}`;
        }
        break;

      case 'list':
        if (!Array.isArray(value)) {
          return `Field '${fieldName}' should be array, got ${actualType}`;
        }
        break;

      case 'object':
        if (actualType !== 'object' || Array.isArray(value)) {
          return `Field '${fieldName}' should be object, got ${actualType}`;
        }
        break;

      case 'reference':
        // References should have @type and id properties
        if (actualType !== 'object' || !value['@type'] || !value.id) {
          return `Field '${fieldName}' should be a Builder reference object with @type and id`;
        }
        break;

      default:
        Logger.warn(`Unknown field type '${fieldType}' for field '${fieldName}'`);
    }

    // Validate enum values if specified
    if (schemaField.enum && Array.isArray(schemaField.enum)) {
      if (!schemaField.enum.includes(value)) {
        return `Field '${fieldName}' value '${value}' is not in allowed enum values: ${schemaField.enum.join(', ')}`;
      }
    }

    return null;
  }

  /**
   * Generate types for model and return validation info
   */
  async ensureTypesAndValidate(modelName: string, contentData?: any): Promise<{
    typesGenerated: boolean;
    filePath?: string;
    validation?: {
      valid: boolean;
      errors: string[];
    };
  }> {
    Logger.info(`Ensuring types and validation for model: ${modelName}`);

    // Get schema and generate types
    const schema = await this.getModelSchema(modelName);
    
    // Get all models for reference mapping
    const modelsResult = await this.adminService.getModels();
    if (modelsResult.success && modelsResult.data?.models) {
      this.typeGenerator.setModelMapping(modelsResult.data.models);
    }

    // Generate TypeScript interface
    const generatedInterface = this.typeGenerator.generateInterface(schema);
    await this.typeGenerator.writeInterface(generatedInterface);

    const result: any = {
      typesGenerated: true,
      filePath: generatedInterface.filePath
    };

    // If content data provided, validate it
    if (contentData) {
      const validation = await this.validateContentAgainstSchema(modelName, contentData);
      result.validation = {
        valid: validation.valid,
        errors: validation.errors
      };
    }

    return result;
  }
}
