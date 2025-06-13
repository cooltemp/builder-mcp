// Robust TypeScript interface generator for Builder.io models

import { promises as fs } from 'fs';
import path from 'path';
import { BuilderField, BUILDER_TYPE_MAP, BUILDER_BUILTIN_FIELDS, BuilderReference } from '@/types';
import { Logger } from '@/utils/logger';

export interface GeneratedInterface {
  name: string;
  content: string;
  filePath: string;
}

export class TypeGenerator {
  private generatedDir: string;
  private modelIdToNameMap: Map<string, string> = new Map();
  private useInterfacePrefix: boolean;

  constructor(
    generatedDir: string = path.join(process.cwd(), 'src', 'types', 'generated'),
    useInterfacePrefix: boolean = true
  ) {
    this.generatedDir = generatedDir;
    this.useInterfacePrefix = useInterfacePrefix;
  }

  /**
   * Set the model ID to name mapping for resolving references
   */
  setModelMapping(models: any[]) {
    this.modelIdToNameMap.clear();
    for (const model of models) {
      if (model.id && model.name) {
        this.modelIdToNameMap.set(model.id, model.name);
      }
    }
  }

  /**
   * Safely escape string values for TypeScript enum literals
   */
  private escapeEnumValue(value: string): string {
    // Clean up malformed values (like trailing quotes)
    const cleanValue = value.trim().replace(/^['"]|['"]$/g, '');
    // Use double quotes to avoid escaping issues with single quotes
    return `"${cleanValue.replace(/"/g, '\\"')}"`;
  }

  /**
   * Convert Builder.io field to TypeScript type for content data (not schema)
   */
  private getContentTypeScriptType(field: BuilderField, depth: number = 0): string {
    // Prevent infinite recursion
    if (depth > 10) {
      Logger.warn(`Maximum recursion depth reached for field: ${field.name}`);
      return 'any';
    }

    try {
      // Handle enums first (most specific) - both 'select' and 'enum' types can have enum values
      if (field.enum && Array.isArray(field.enum) && field.enum.length > 0) {
        const enumValues = field.enum
          .filter(value => value != null && value !== '')
          .map(value => this.escapeEnumValue(String(value)));
        return enumValues.length > 0 ? enumValues.join(' | ') : 'string';
      }

      // Handle arrays/lists - content data structure
      if (field.type === 'list' && field.subFields && Array.isArray(field.subFields) && field.subFields.length > 0) {
        const itemType = field.subFields
          .map(subField => {
            const optional = subField.required ? '' : '?';
            return `${subField.name}${optional}: ${this.getContentTypeScriptType(subField, depth + 1)}`;
          })
          .join('; ');
        return `Array<{${itemType}}>`;
      }

      // Handle objects with subfields - content data structure
      if (field.type === 'object' && field.subFields && Array.isArray(field.subFields) && field.subFields.length > 0) {
        const objectType = field.subFields
          .map(subField => {
            const optional = subField.required ? '' : '?';
            return `${subField.name}${optional}: ${this.getContentTypeScriptType(subField, depth + 1)}`;
          })
          .join('; ');
        return `{${objectType}}`;
      }

      // Handle references - in content API, these are BuilderReference objects
      if (field.type === 'reference') {
        // Try to resolve model name from modelId first, then fall back to model field
        let modelName = '';
        if (field.modelId && this.modelIdToNameMap.has(field.modelId)) {
          modelName = this.modelIdToNameMap.get(field.modelId)!;
        } else if (field.model) {
          modelName = field.model;
        }

        if (modelName) {
          // Type the reference with the specific model's data type
          const referencedModelName = this.toPascalCase(modelName);
          return `BuilderReference<${referencedModelName}Content>`;
        }
        return 'BuilderReference';
      }

      // Map Builder.io field types to TypeScript types for content
      const typeMapping: Record<string, string> = {
        'text': 'string',
        'longText': 'string',
        'richText': 'string',
        'html': 'string',
        'markdown': 'string',
        'number': 'number',
        'boolean': 'boolean',
        'date': 'string', // Content API returns dates as ISO strings
        'datetime': 'string',
        'file': 'string',
        'image': 'string',
        'video': 'string',
        'select': 'string',
        'enum': 'string',
        'code': 'any',
        'color': 'string',
        'url': 'string',
        'email': 'string',
        'phone': 'string',
        'blocks': 'any'
      };

      return typeMapping[field.type] || 'any';
    } catch (error) {
      Logger.warn(`Error processing field ${field.name}:`, error);
      return 'any';
    }
  }

  /**
   * Convert string to PascalCase with better handling for acronyms
   */
  private toPascalCase(str: string): string {
    // Common acronyms that should remain uppercase
    const acronyms = new Set(['HVAC', 'API', 'URL', 'HTML', 'CSS', 'JS', 'TS', 'ID', 'UUID']);

    const pascalCase = str
      .replace(/[^a-zA-Z0-9]+/g, ' ') // Replace non-alphanumeric with spaces
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => {
        const upperWord = word.toUpperCase();
        // Keep acronyms uppercase, otherwise use PascalCase
        return acronyms.has(upperWord) ? upperWord : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join('');

    return this.useInterfacePrefix ? `I${pascalCase}` : pascalCase;
  }

  /**
   * Filter out duplicate fields, prioritizing custom fields over built-ins
   */
  private filterFields(fields: BuilderField[]): BuilderField[] {
    if (!Array.isArray(fields)) {
      return [];
    }

    // Only include custom fields (non-built-in fields)
    const customFields = fields.filter(field =>
      field.name &&
      typeof field.name === 'string' &&
      !BUILDER_BUILTIN_FIELDS.has(field.name)
    );

    // Remove duplicates by name (keep the last occurrence)
    const fieldMap = new Map<string, BuilderField>();
    for (const field of customFields) {
      fieldMap.set(field.name, field);
    }

    return Array.from(fieldMap.values());
  }

  /**
   * Extract referenced model names from fields
   */
  private extractReferencedModels(fields: BuilderField[]): string[] {
    const referencedModels = new Set<string>();

    const extractFromField = (field: BuilderField) => {
      if (field.type === 'reference') {
        // Try to resolve model name from modelId first, then fall back to model field
        let modelName = '';
        if (field.modelId && this.modelIdToNameMap.has(field.modelId)) {
          modelName = this.modelIdToNameMap.get(field.modelId)!;
        } else if (field.model) {
          modelName = field.model;
        }

        if (modelName) {
          referencedModels.add(modelName);
        }
      }

      // Check subfields recursively
      if (field.subFields && Array.isArray(field.subFields)) {
        field.subFields.forEach(extractFromField);
      }
    };

    fields.forEach(extractFromField);
    return Array.from(referencedModels);
  }

  /**
   * Generate TypeScript interface for content data structure
   */
  generateInterface(model: any): GeneratedInterface {
    const interfaceName = this.toPascalCase(model.name);
    const modelFields = Array.isArray(model.fields) ? model.fields : [];

    // Filter and process fields for content data structure
    const filteredFields = this.filterFields(modelFields);

    // Extract referenced models for imports
    const referencedModels = this.extractReferencedModels(filteredFields);

    const dataFieldDefinitions = filteredFields
      .map((field: BuilderField) => {
        try {
          const optional = field.required ? '' : '?';
          const type = this.getContentTypeScriptType(field);
          return `  ${field.name}${optional}: ${type};`;
        } catch (error) {
          Logger.warn(`Error processing field ${field.name} in model ${model.name}:`, error);
          return `  ${field.name}?: any; // Error processing field type`;
        }
      })
      .join('\n');

    // Generate imports
    const imports = ['import type { BuilderReference } from \'@/types\';'];
    if (referencedModels.length > 0) {
      const referencedImports = referencedModels
        .map(modelName => `${this.toPascalCase(modelName)}Content`)
        .join(', ');
      imports.push(`import type { ${referencedImports} } from '@/types/generated';`);
    }

    const content = `// Auto-generated TypeScript interfaces for ${model.name} content
// Generated on: ${new Date().toISOString()}

${imports.join('\n')}

// Content entry structure (full response from Content API)
export interface ${interfaceName}Content {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: ${interfaceName}Data;
}

// Data structure (nested under 'data' property in content)
export interface ${interfaceName}Data {
${dataFieldDefinitions}
}
`;

    return {
      name: interfaceName,
      content,
      filePath: path.join(this.generatedDir, `${model.name}.ts`)
    };
  }

  /**
   * Generate index file that exports all interfaces
   */
  generateIndexFile(interfaces: GeneratedInterface[]): string {
    const imports = interfaces
      .map(iface => `export type { ${iface.name}Content, ${iface.name}Data } from './${path.basename(iface.filePath, '.ts')}';`)
      .join('\n');

    return `// Auto-generated index file for Builder.io content interfaces
// Generated on: ${new Date().toISOString()}

${imports}
`;
  }

  /**
   * Write interface to file
   */
  async writeInterface(generatedInterface: GeneratedInterface): Promise<void> {
    await fs.mkdir(this.generatedDir, { recursive: true });
    await fs.writeFile(generatedInterface.filePath, generatedInterface.content, 'utf8');
    Logger.info(`Generated interface: ${generatedInterface.filePath}`);
  }

  /**
   * Write index file
   */
  async writeIndexFile(content: string): Promise<void> {
    const indexPath = path.join(this.generatedDir, 'index.ts');
    await fs.writeFile(indexPath, content, 'utf8');
    Logger.info(`Generated index file: ${indexPath}`);
  }

  /**
   * Clean generated directory
   */
  async cleanGeneratedDir(): Promise<void> {
    try {
      const files = await fs.readdir(this.generatedDir);
      for (const file of files) {
        if (file.endsWith('.ts')) {
          await fs.unlink(path.join(this.generatedDir, file));
        }
      }
      Logger.info('Cleaned generated directory');
    } catch (error) {
      // Directory might not exist, which is fine
      Logger.debug('Generated directory does not exist or is empty');
    }
  }
}
