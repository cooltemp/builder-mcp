import fs from 'fs';
import path from 'path';
import {
  BuilderModel,
  BuilderField,
  GeneratedTypeInfo,
  TypeFieldInfo
} from '@/builder/types';
import logger from '@/utils/logger';

export class TypeScriptGenerator {
  private readonly outputDir: string;

  constructor(outputDir: string = 'generated/types') {
    this.outputDir = outputDir;
    this.ensureOutputDirectory();
  }

  /**
   * Generate TypeScript interfaces for all models
   */
  async generateAllTypes(models: BuilderModel[]): Promise<GeneratedTypeInfo[]> {
    const generatedTypes: GeneratedTypeInfo[] = [];

    for (const model of models) {
      try {
        const typeInfo = await this.generateModelType(model);
        generatedTypes.push(typeInfo);
      } catch (error) {
        logger.error(`Failed to generate types for model ${model.name}`, error);
      }
    }

    // Generate index file
    await this.generateIndexFile(generatedTypes);

    logger.info(`Generated TypeScript interfaces for ${generatedTypes.length} models`);
    return generatedTypes;
  }

  /**
   * Generate TypeScript interface for a single model
   */
  async generateModelType(model: BuilderModel): Promise<GeneratedTypeInfo> {
    const interfaceName = this.getInterfaceName(model.name);
    const fileName = this.getFileName(model.name);
    const filePath = path.join(this.outputDir, fileName);

    const typeFields = model.fields.map(field => this.convertFieldToTypeInfo(field));
    
    const interfaceContent = this.generateInterfaceContent(
      interfaceName,
      typeFields,
      model
    );

    await fs.promises.writeFile(filePath, interfaceContent, 'utf8');

    const typeInfo: GeneratedTypeInfo = {
      modelId: model.id,
      modelName: model.name,
      interfaceName,
      filePath,
      generatedAt: new Date().toISOString(),
      fields: typeFields,
    };

    logger.debug(`Generated TypeScript interface for model ${model.name}`, typeInfo);
    return typeInfo;
  }

  /**
   * Convert Builder field to TypeScript type information
   */
  private convertFieldToTypeInfo(field: BuilderField): TypeFieldInfo {
    const tsType = this.mapBuilderTypeToTypeScript(field);
    
    return {
      name: field.name,
      type: tsType,
      optional: !field.required,
      description: field.helperText,
      enumValues: field.enum,
    };
  }

  /**
   * Map Builder.io field types to TypeScript types
   */
  private mapBuilderTypeToTypeScript(field: BuilderField): string {
    // Check for custom TypeScript type in meta
    if (field.meta?.ts?.type) {
      return field.meta.ts.type;
    }

    switch (field.type) {
      case 'text':
      case 'longText':
      case 'richText':
      case 'color':
      case 'url':
      case 'email':
        return field.enum ? this.generateEnumType(field.enum) : 'string';
      
      case 'number':
        return 'number';
      
      case 'boolean':
        return 'boolean';
      
      case 'date':
        return 'string | Date';
      
      case 'file':
        return 'string'; // URL to file
      
      case 'reference':
        if (field.model) {
          const referencedInterface = this.getInterfaceName(field.model);
          return `string | ${referencedInterface}`;
        }
        return 'string';
      
      case 'list':
        if (field.subFields && field.subFields.length > 0) {
          const itemType = this.generateObjectType(field.subFields);
          return `${itemType}[]`;
        }
        return 'any[]';
      
      case 'object':
        if (field.subFields && field.subFields.length > 0) {
          return this.generateObjectType(field.subFields);
        }
        return 'Record<string, any>';
      
      case 'blocks':
        return 'any[]'; // Builder.io blocks are complex
      
      default:
        logger.warn(`Unknown field type: ${field.type}`, { fieldName: field.name });
        return 'any';
    }
  }

  /**
   * Generate enum type from array of values
   */
  private generateEnumType(values: string[]): string {
    return values.map(value => `'${value}'`).join(' | ');
  }

  /**
   * Generate object type from subfields
   */
  private generateObjectType(subFields: BuilderField[]): string {
    const properties = subFields.map(field => {
      const optional = !field.required ? '?' : '';
      const type = this.mapBuilderTypeToTypeScript(field);
      return `  ${field.name}${optional}: ${type};`;
    });

    return `{\n${properties.join('\n')}\n}`;
  }

  /**
   * Generate the complete interface content
   */
  private generateInterfaceContent(
    interfaceName: string,
    fields: TypeFieldInfo[],
    model: BuilderModel
  ): string {
    const imports = this.generateImports(fields);
    const interfaceBody = this.generateInterfaceBody(fields);
    
    return `${this.generateFileHeader(model)}
${imports}

/**
 * TypeScript interface for Builder.io model: ${model.name}
 * Generated on: ${new Date().toISOString()}
 * Model ID: ${model.id}
 * Model Kind: ${model.kind}
 */
export interface ${interfaceName} {
${interfaceBody}
}

/**
 * Type guard to check if an object is a valid ${interfaceName}
 */
export function is${interfaceName}(obj: any): obj is ${interfaceName} {
  return obj && typeof obj === 'object';
}

/**
 * Default values for ${interfaceName}
 */
export const default${interfaceName}: Partial<${interfaceName}> = {
${this.generateDefaultValues(fields)}
};
`;
  }

  /**
   * Generate file header with metadata
   */
  private generateFileHeader(model: BuilderModel): string {
    return `/**
 * Auto-generated TypeScript interfaces for Builder.io
 * 
 * Model: ${model.name}
 * ID: ${model.id}
 * Kind: ${model.kind}
 * 
 * DO NOT EDIT THIS FILE MANUALLY
 * This file is automatically generated from Builder.io model schemas
 */`;
  }

  /**
   * Generate necessary imports
   */
  private generateImports(fields: TypeFieldInfo[]): string {
    const imports: string[] = [];
    
    // Check if we need to import other interfaces
    const referencedTypes = fields
      .map(field => field.type)
      .filter(type => type.includes('Interface'))
      .map(type => type.split(' | ')[1])
      .filter(Boolean);

    if (referencedTypes.length > 0) {
      imports.push(`import { ${referencedTypes.join(', ')} } from './index';`);
    }

    return imports.length > 0 ? imports.join('\n') : '';
  }

  /**
   * Generate interface body
   */
  private generateInterfaceBody(fields: TypeFieldInfo[]): string {
    return fields.map(field => {
      const optional = field.optional ? '?' : '';
      const comment = field.description ? `  /** ${field.description} */\n` : '';
      return `${comment}  ${field.name}${optional}: ${field.type};`;
    }).join('\n');
  }

  /**
   * Generate default values
   */
  private generateDefaultValues(fields: TypeFieldInfo[]): string {
    return fields
      .filter(field => !field.optional)
      .map(field => {
        let defaultValue = 'undefined';
        
        if (field.type === 'string') defaultValue = "''";
        else if (field.type === 'number') defaultValue = '0';
        else if (field.type === 'boolean') defaultValue = 'false';
        else if (field.type.includes('[]')) defaultValue = '[]';
        else if (field.type.includes('{')) defaultValue = '{}';
        
        return `  ${field.name}: ${defaultValue},`;
      })
      .join('\n');
  }

  /**
   * Generate index file that exports all interfaces
   */
  private async generateIndexFile(typeInfos: GeneratedTypeInfo[]): Promise<void> {
    const exports = typeInfos.map(info => {
      const fileName = path.basename(info.filePath, '.ts');
      return `export * from './${fileName}';`;
    }).join('\n');

    const indexContent = `${this.generateFileHeader({
      name: 'All Models',
      id: 'index',
      kind: 'data' as const,
      fields: [],
      createdDate: Date.now(),
      lastUpdated: Date.now(),
      published: 'published' as const,
    })}

${exports}

/**
 * All generated type information
 */
export const generatedTypes = ${JSON.stringify(typeInfos, null, 2)};
`;

    const indexPath = path.join(this.outputDir, 'index.ts');
    await fs.promises.writeFile(indexPath, indexContent, 'utf8');
  }

  /**
   * Convert model name to interface name
   */
  private getInterfaceName(modelName: string): string {
    return modelName
      .split(/[-_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('') + 'Interface';
  }

  /**
   * Convert model name to file name
   */
  private getFileName(modelName: string): string {
    return modelName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') + '.ts';
  }

  /**
   * Ensure output directory exists
   */
  private ensureOutputDirectory(): void {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
      logger.info(`Created output directory: ${this.outputDir}`);
    }
  }
}

// Export singleton instance
export const typeScriptGenerator = new TypeScriptGenerator();
