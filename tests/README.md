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

# MCP Tools tests (NEW)
npm run test:mcp-tools

# Express API tests (NEW)
npm run test:express-api

# MCP Server tests (NEW)
npm run test:mcp-server

# Integration tests (NEW)
npm run test:integration

# All tests
npm run test:all

# Comprehensive new test suite
npm run test:comprehensive
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

### 🔧 MCP Tools Testing (`mcp-tools.test.ts`) - NEW

Direct testing of MCP tool functions and validation:

1. **Tool Registration and Schema**
   - Validates all 18 MCP tools are registered correctly
   - Tests input schema validation for each tool
   - Verifies proper tool descriptions and handlers

2. **Model Management Tools**
   - Tests `list_models_node` MCP response format
   - Tests `get_model_ids_node` data structure
   - Tests `create_model_node` input validation and creation
   - Tests `get_model_node` with valid and invalid IDs

3. **Content Management Tools**
   - Tests `get_content_node` model parameter validation
   - Tests `create_content_node` required field validation
   - Tests content tool error handling

4. **Type Generation Tools**
   - Tests `generate_types_node` execution
   - Tests `generate_types_for_model_node` validation
   - Tests type generation workflows

5. **Error Handling**
   - Tests network error handling across all tools
   - Validates consistent error response format
   - Tests tool execution with invalid configurations

### 🌐 Express API Testing (`express-api.test.ts`) - NEW

HTTP endpoint and middleware testing using Supertest:

1. **Models API Routes**
   - Tests `GET /models` endpoint response format
   - Tests `GET /models/ids` minimal data structure
   - Tests `GET /models/schema` GraphQL introspection
   - Tests `POST /models` with validation and creation
   - Tests `GET /models/:id` with valid and invalid IDs
   - Tests `PUT /models/:id` update functionality
   - Tests `DELETE /models/:id` deletion workflow

2. **Content API Routes**
   - Tests `GET /content/:model` with query parameters
   - Tests `GET /content/:model/:id` specific content retrieval
   - Tests `POST /content/:model` content creation validation

3. **Upload API Routes**
   - Tests `POST /upload` file upload validation
   - Tests `POST /upload-url` URL parameter validation

4. **Types API Routes**
   - Tests `POST /generate-types` type generation
   - Tests `POST /generate-types/:model` model-specific generation

5. **Error Handling Middleware**
   - Tests 404 route handling
   - Tests validation error consistency
   - Tests error response format standardization

### 🔌 MCP Server Testing (`mcp-server.test.ts`) - NEW

MCP protocol compliance and server integration testing:

1. **MCP Protocol Compliance**
   - Tests `ListToolsRequest` response format
   - Tests `ListResourcesRequest` response format
   - Tests `CallToolRequest` with valid and invalid tools
   - Tests `ReadResourceRequest` resource access

2. **Tool Execution Flow**
   - Tests model creation workflow through MCP
   - Tests model retrieval workflow through MCP
   - Tests type generation workflow through MCP

3. **Error Handling in MCP Context**
   - Tests tool execution error handling
   - Tests validation error format in MCP context
   - Tests network error handling in MCP format

4. **Resource Access Flow**
   - Tests model information through MCP resources
   - Tests server info through MCP resources

5. **MCP Response Format Validation**
   - Tests consistent MCP response format across all tools
   - Validates JSON content structure
   - Tests MCP protocol compliance

### 🔄 Integration Testing (`integration.test.ts`) - NEW

End-to-end workflow and cross-layer integration testing:

1. **End-to-End Model Lifecycle**
   - Complete workflow: create → verify → update → verify → delete
   - Tests Express API and MCP tool integration
   - Tests TypeScript type generation integration
   - Validates data consistency across all layers

2. **Cross-Layer Data Consistency**
   - Compares Express API and MCP tool responses
   - Tests MCP resource and tool data consistency
   - Validates identical data across different access methods

3. **Type Generation Integration**
   - Tests type generation via Express API and MCP tools
   - Tests type validation against actual content
   - Validates generated TypeScript interface consistency

4. **Error Handling Integration**
   - Tests error consistency across Express API and MCP tools
   - Validates error response format standardization
   - Tests error propagation through all layers

5. **Performance and Reliability**
   - Tests concurrent request handling
   - Tests performance under load
   - Validates system reliability

6. **Real-World Workflow Simulation**
   - Simulates typical AI agent workflow
   - Tests complete discovery → generation → validation cycle
   - Validates practical usage scenarios

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
