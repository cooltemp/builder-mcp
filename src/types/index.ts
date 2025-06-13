// Common types for Builder.io MCP

export interface BuilderConfig {
  apiKey: string;
  privateKey: string;
}

export interface BuilderModel {
  id: string;
  name: string;
  kind: string;
  fields: BuilderField[];
  createdDate: number;
  lastUpdated: number;
}

export interface BuilderField {
  '@type'?: string;
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
  enum?: string[];
  subFields?: BuilderField[];
  model?: string;
  meta?: any;
  helperText?: string;
  autoFocus?: boolean;
  simpleTextOnly?: boolean;
  disallowRemove?: boolean;
  broadcast?: boolean;
  bubble?: boolean;
  hideFromUI?: boolean;
  hideFromFieldsEditor?: boolean;
  showTemplatePicker?: boolean;
  permissionsRequiredToEdit?: string;
  advanced?: boolean;
  copyOnAdd?: boolean;
  onChange?: string;
  behavior?: string;
  showIf?: string;
  mandatory?: boolean;
  hidden?: boolean;
  noPhotoPicker?: boolean;
  supportsAiGeneration?: boolean;
  includeInStyleTab?: boolean;
  defaultCollapsed?: boolean;
  allowedFileTypes?: string[];
  modelId?: string;
  friendlyName?: string;
  localized?: boolean;
}

export interface BuilderContent {
  id: string;
  name: string;
  data: Record<string, any>;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated: number;
  modelId: string;
  rev?: string;
}

// Builder.io Reference type for linked content
export interface BuilderReference<T = any> {
  '@type': '@builder.io/core:Reference';
  id: string;
  model: string;
  value?: T; // Populated when includeRefs=true is used
}

export interface ContentQuery {
  apiKey?: string;
  enrich?: boolean;
  fields?: string;
  omit?: string;
  query?: string;
  sort?: string;
  limit?: number;
  offset?: number;
  noTargeting?: boolean;
  includeRefs?: boolean;
  cacheSeconds?: number;
  staleCacheSeconds?: number;
  userAttributes?: Record<string, any>;
  includeUnpublished?: boolean;
}

export interface UploadResponse {
  url: string;
  id: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status: number;
}

// TypeScript type mapping for Builder.io field types
export const BUILDER_TYPE_MAP: Record<string, string> = {
  'text': 'string',
  'longText': 'string',
  'richText': 'string',
  'html': 'string',
  'markdown': 'string',
  'number': 'number',
  'boolean': 'boolean',
  'date': 'Date',
  'datetime': 'Date',
  'file': 'string',
  'image': 'string',
  'video': 'string',
  'reference': 'string',
  'list': 'any[]',
  'object': 'Record<string, any>',
  'blocks': 'any',
  'color': 'string',
  'url': 'string',
  'email': 'string',
  'phone': 'string'
};

// Built-in fields that are automatically added to all Builder.io models
export const BUILDER_BUILTIN_FIELDS = new Set([
  'id',
  'name',
  'published',
  'createdDate',
  'lastUpdated',
  'createdBy',
  'lastUpdatedBy',
  'modelId',
  'testRatio',
  'screenshot',
  'variations',
  'rev'
]);
