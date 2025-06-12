// Builder.io API Types

export interface BuilderModel {
  id: string;
  name: string;
  kind: 'page' | 'data' | 'component';
  fields: BuilderField[];
  createdDate: number;
  lastUpdated: number;
  published: 'draft' | 'published' | 'archived';
  meta?: {
    description?: string;
    tags?: string[];
  };
}

export interface BuilderField {
  name: string;
  type: BuilderFieldType;
  required?: boolean;
  defaultValue?: any;
  helperText?: string;
  enum?: string[];
  subFields?: BuilderField[];
  model?: string; // For reference fields
  meta?: {
    ts?: {
      type?: string;
      interface?: string;
    };
  };
}

export type BuilderFieldType = 
  | 'text'
  | 'longText'
  | 'richText'
  | 'number'
  | 'boolean'
  | 'date'
  | 'file'
  | 'reference'
  | 'list'
  | 'object'
  | 'color'
  | 'url'
  | 'email'
  | 'blocks';

export interface BuilderContent {
  id: string;
  name: string;
  modelId: string;
  published: 'draft' | 'published' | 'archived';
  data: Record<string, any>;
  createdDate: number;
  lastUpdated: number;
  createdBy: string;
  lastUpdatedBy: string;
  meta?: {
    urlPath?: string;
    title?: string;
    description?: string;
  };
}

export interface BuilderApiResponse<T> {
  results: T[];
  count: number;
  offset: number;
  limit: number;
}

export interface BuilderApiError {
  message: string;
  code?: string;
  details?: any;
}

// Type generation specific types
export interface GeneratedTypeInfo {
  modelId: string;
  modelName: string;
  interfaceName: string;
  filePath: string;
  generatedAt: string;
  fields: TypeFieldInfo[];
}

export interface TypeFieldInfo {
  name: string;
  type: string;
  optional: boolean;
  description?: string;
  enumValues?: string[];
}

// Content API request/response types
export interface CreateContentRequest {
  name: string;
  data: Record<string, any>;
  published?: 'draft' | 'published';
  meta?: {
    urlPath?: string;
    title?: string;
    description?: string;
  };
}

export interface UpdateContentRequest {
  name?: string;
  data?: Record<string, any>;
  published?: 'draft' | 'published';
  meta?: {
    urlPath?: string;
    title?: string;
    description?: string;
  };
}

// Admin API request types
export interface GetModelsOptions {
  limit?: number;
  offset?: number;
  includeFields?: boolean;
}

export interface GetContentOptions {
  limit?: number;
  offset?: number;
  published?: 'draft' | 'published' | 'archived';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  query?: Record<string, any>;
}
