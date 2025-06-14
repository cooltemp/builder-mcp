// Basic validation helpers

export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw new Error(`${fieldName} is required`);
  }
}

export function validateString(value: any, fieldName: string): void {
  if (typeof value !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
}

export function validateNumber(value: any, fieldName: string): void {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new Error(`${fieldName} must be a valid number`);
  }
}

export function validateBoolean(value: any, fieldName: string): void {
  if (typeof value !== 'boolean') {
    throw new Error(`${fieldName} must be a boolean`);
  }
}

export function validateModelName(name: string): void {
  validateRequired(name, 'Model name');
  validateString(name, 'Model name');
  
  if (!/^[a-zA-Z][a-zA-Z0-9-_]*$/.test(name)) {
    throw new Error('Model name must start with a letter and contain only letters, numbers, hyphens, and underscores');
  }
}

export function validateContentData(data: any): void {
  if (!data || typeof data !== 'object') {
    throw new Error('Content data must be an object');
  }
}

export function validateUrl(url: string): void {
  validateRequired(url, 'URL');
  validateString(url, 'URL');

  try {
    new URL(url);
  } catch (error) {
    throw new Error('URL must be a valid URL');
  }
}
