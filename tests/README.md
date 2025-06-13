# Builder.io MCP Tests

Comprehensive test suite for the Builder.io MCP server using Vitest.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   Create a `.env` file with your Builder.io credentials:
   ```env
   BUILDER_API_KEY=your_api_key_here
   BUILDER_PRIVATE_KEY=your_private_key_here
   ```

## Running Tests

### All Tests
```bash
npm run test
```

### Specific Test Suites
```bash
# Models API tests
npm run test:models

# Content API tests
npm run test:content

# Upload API tests
npm run test:upload

# TypeScript generation tests
npm run test:types

# All tests
npm run test:all
```

### Watch Mode
```bash
npm run test:watch
```

### Single Run
```bash
npm run test:run
```

## Test Coverage

### 🔧 Models API (`models.test.ts`)

Comprehensive testing for all Builder.io model operations:

### ✅ Test Scenarios Covered

1. **List All Models** - `GET /models`
   - Fetches all models from Builder.io
   - Validates response structure and data types

2. **List Model IDs** - `GET /models/ids`
   - Fetches only model IDs and names
   - Validates minimal response structure

3. **Get Specific Model** - `GET /models/:id`
   - Fetches a specific model by ID
   - Tests error handling for non-existent models

4. **Create New Model** - `POST /models`
   - Creates a test model with basic fields
   - Validates successful creation and response data

5. **Verify Model Exists**
   - Confirms the created model appears in models list
   - Verifies model can be fetched by ID

6. **Update Model** - `PUT /models/:id`
   - Adds a description field to the test model
   - Validates successful update

7. **Verify Field Addition**
   - Confirms the new description field exists
   - Validates field properties and structure

8. **Delete Model** - `DELETE /models/:id`
   - Deletes the test model
   - Validates successful deletion

9. **Verify Deletion**
   - Confirms model no longer exists in models list
   - Verifies error when trying to fetch deleted model

10. **Error Handling**
    - Tests invalid model creation
    - Tests updates to non-existent models
    - Tests deletion of non-existent models

### 📄 Content API (`content.test.ts`)

Comprehensive testing for all Builder.io content operations:

1. **Get Content from Model** - `GET /content/:model`
   - Fetches content from existing models
   - Tests query parameters (limit, includeRefs, cacheSeconds)
   - Handles non-existent models gracefully

2. **Get Content by ID** - `GET /content/:model/:id`
   - Fetches specific content entries by ID
   - Tests error handling for non-existent content

3. **Create Content** - `POST /content/:model`
   - Creates new content entries with test data
   - Validates response structure and draft status

4. **Update Content** - `PUT /content/:model/:id`
   - Updates existing content entries
   - Validates updated data and metadata

5. **Publish Content** - `POST /content/:model/:id/publish`
   - Publishes draft content entries
   - Validates published status change

6. **Unpublish Content** - `POST /content/:model/:id/unpublish`
   - Unpublishes content back to draft
   - Validates status change back to draft

7. **Search Content**
   - Tests text-based content search
   - Handles empty search results gracefully

8. **Error Handling**
   - Tests invalid content creation
   - Tests updates to non-existent content
   - Tests publish operations on non-existent content

### 📁 Upload API (`upload.test.ts`)

Comprehensive testing for all Builder.io upload operations:

1. **Upload from URL** - `POST /upload/url`
   - Uploads image from https://placehold.co/600x400
   - Tests with folder and metadata options
   - Handles invalid and non-existent URLs

2. **File Upload** - `POST /upload`
   - Uploads file buffers (1x1 PNG test image)
   - Tests with folder and metadata options
   - Handles empty buffers gracefully

3. **Get File Info** - `GET /upload/:id`
   - Retrieves file information and metadata
   - Tests error handling for non-existent files

4. **Delete File** - `DELETE /upload/:id`
   - Deletes uploaded test files
   - Tests error handling for non-existent files

5. **Error Handling**
   - Tests network error scenarios
   - Validates file type restrictions (route-level)

### 🔤 TypeScript Generation (`types.test.ts`)

Comprehensive testing for TypeScript interface generation:

1. **Generate All Interfaces** - `GET /generate-types`
   - Generates interfaces for all available models
   - Creates and validates index file
   - Tests file creation and content structure

2. **Generate Specific Interface** - `GET /generate-types/:model`
   - Generates interface for individual models
   - Tests various field type mappings
   - Validates TypeScript syntax

3. **File Operations**
   - Tests directory cleaning functionality
   - Handles missing directories gracefully
   - Validates file write operations

4. **Error Handling**
   - Handles models with no fields
   - Handles invalid field types gracefully
   - Handles malformed model data

5. **TypeScript Validation**
   - Validates syntactically correct TypeScript
   - Tests consistent naming conventions
   - Verifies proper interface structure

### 🧹 Cleanup

The test suite automatically cleans up any test models created during testing, even if tests fail.

### ⚠️ Important Notes

- Tests require valid Builder.io API credentials
- Tests will be skipped if credentials are not found
- A temporary test model named `test-model-vitest` is created and deleted
- Tests use real API calls to Builder.io (not mocked)
- Each test run is independent and cleans up after itself

### 🔧 Configuration

Test configuration is in `vitest.config.ts`:
- 30-second timeout for API calls
- Node.js environment
- Path aliases matching the main application
- Global test utilities available

### 📊 Expected Output

When running successfully, you should see:
```
✅ Found X models
✅ Found X model IDs  
✅ Successfully fetched model: model-name
✅ Successfully created test model with ID: abc123
✅ Verified test model exists in models list
✅ Successfully added description field to test model
✅ Verified description field is present in updated model
✅ Successfully deleted test model: abc123
✅ Verified test model no longer exists in models list
```

## Troubleshooting

### Missing API Keys
If you see warnings about missing API keys, add them to your `.env` file:
```env
BUILDER_API_KEY=your_actual_api_key
BUILDER_PRIVATE_KEY=your_actual_private_key
```

### API Errors
If tests fail with API errors:
1. Verify your API keys are correct
2. Check your Builder.io account permissions
3. Ensure you have access to the Admin API

### Network Issues
If tests timeout:
1. Check your internet connection
2. Verify Builder.io API is accessible
3. Consider increasing timeout in `vitest.config.ts`
