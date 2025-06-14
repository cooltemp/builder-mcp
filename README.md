# Builder.io MCP Server

A simple, clean, and functional Node.js + TypeScript app for working with Builder.io from your local development environment. This server provides both REST API and Model Context Protocol (MCP) interfaces for managing Builder.io content, models, uploads, and TypeScript generation. It integrates with Augment Code and allows you to manage CMS models, write and read content, upload media, and generate strict TypeScript interfaces for your Qwik frontend.

## Features

- **Dual Interface**: Both REST API and MCP (Model Context Protocol) support
- **Model Management**: Create, read, update, and delete Builder.io models
- **Content Management**: CRUD operations for content entries
- **Media Upload**: Upload files and manage media assets
- **TypeScript Generation**: Auto-generate strict interfaces for Qwik frontend
- **Augment Integration**: Native MCP support for AI-powered development
- **Clean Architecture**: Well-structured with routes, services, types, and utils
- **Comprehensive Logging**: Request/response logging for debugging

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and fill in your Builder.io credentials:

```bash
cp .env.example .env
```

Edit `.env`:
```env
BUILDER_API_KEY=your_builder_api_key_here
BUILDER_PRIVATE_KEY=your_builder_private_key_here
BUILDER_SPACE_ID=your_builder_space_id_here
PORT=3000
NODE_ENV=development
```

### 3. Build and Run

```bash
# Build for production
npm run build

# REST API mode (Express server)
npm run dev          # Development with hot reload
npm start            # Production

# MCP mode (for Augment integration)
npm run dev:mcp      # Development with hot reload
npm run start:mcp    # Production
```

### 4. Configure Augment (MCP Mode)

The `settings.json` file is already configured for Augment Code integration:

```json
{
  "augment.advanced.mcpServers": [
    {
      "name": "builder-mcp",
      "command": "node",
      "args": ["/Users/justinbeattie/Development/builder-mcp/dist/mcp/server.js"],
      "cwd": "/Users/justinbeattie/Development/builder-mcp"
    }
  ]
}
```

This enables AI agents to directly interact with Builder.io through MCP tools and resources.

## MCP Tools & Resources

### MCP Tools (Actions)
- **Models**: `list_models`, `get_model_ids`, `get_model`, `create_model`, `update_model`, `delete_model`
- **Content**: `get_content`, `get_content_by_id`, `create_content`, `update_content`, `publish_content`, `unpublish_content`
- **Upload**: `upload_from_url`, `get_file_info`, `delete_file`
- **Types**: `generate_types`, `generate_types_for_model`

### MCP Resources (Data Access)
- `builder://models` - List of all Builder.io models
- `builder://models/ids` - Model IDs and names only
- `builder://schema` - GraphQL schema introspection
- `builder://health` - Health status of the MCP server
- `builder://info` - Information about available tools and capabilities

## REST API Endpoints

### Models
- `GET /models` - List all models
- `GET /models/:id` - Get specific model
- `POST /models` - Create new model
- `PUT /models/:id` - Update model
- `DELETE /models/:id` - Delete model

### Content
- `GET /content/:model` - Query published entries with full Builder.io query support
- `GET /content/:model/:id` - Get specific content entry
- `POST /content/:model` - Create entry
- `PUT /content/:model/:id` - Update entry
- `POST /content/:model/:id/publish` - Publish content
- `POST /content/:model/:id/unpublish` - Unpublish content

### Media Upload
- `POST /upload` - Upload file (multipart/form-data)
- `POST /upload/url` - Upload from URL
- `GET /upload/:id` - Get file info
- `DELETE /upload/:id` - Delete file

### TypeScript Interface Generator
- `GET /generate-types` - Generate interfaces for all models
- `GET /generate-types/:model` - Generate interface for specific model

## Builder.io APIs Integrated

### 1. Admin API (GraphQL)
- **Endpoint**: `https://builder.io/api/v1/admin/graphql`
- **Purpose**: Managing models (CRUD operations)
- **Documentation**: [Builder.io Admin API](https://www.builder.io/c/docs/admin-graphql-api)

### 2. Write API
- **Endpoint**: `https://builder.io/api/v1/write/:model`
- **Purpose**: Creating and updating content entries
- **Documentation**: [Builder.io Write API](https://www.builder.io/c/docs/write-api)

### 3. Content API
- **Endpoint**: `https://cdn.builder.io/api/v3/content/:model`
- **Purpose**: Reading published content with advanced querying
- **Documentation**: [Builder.io Query API](https://www.builder.io/c/docs/query-api)

### 4. Upload API
- **Endpoint**: `https://builder.io/api/v1/upload`
- **Purpose**: Uploading media and getting file URLs
- **Documentation**: [Builder.io Upload API](https://www.builder.io/c/docs/upload-api)

## Content API Query Parameters

The content endpoints support all Builder.io query parameters:

- `apiKey` - API key (automatically included)
- `enrich` - Include referenced content
- `fields` - Specific fields to include
- `omit` - Fields to exclude
- `query` - MongoDB-style query
- `sort` - Sort order
- `limit` - Number of results
- `offset` - Pagination offset
- `noTargeting` - Disable targeting
- `includeRefs` - Include references
- `cacheSeconds` - Cache duration
- `staleCacheSeconds` - Stale cache duration
- `userAttributes` - User attributes for targeting
- `includeUnpublished` - Include draft content

## TypeScript Interface Generation

The MCP automatically generates strict TypeScript interfaces that match Builder.io **content API responses** for use in your frontend:

```typescript
// Example generated interfaces
export interface BlogPostContent {
  id: string;
  name: string;
  published: 'published' | 'draft' | 'archived';
  createdDate: number;
  lastUpdated?: number;
  modelId: string;
  rev?: string;
  data: BlogPostData;
}

export interface BlogPostData {
  title?: string;
  content?: string;
  author?: BuilderReference;
  tags?: string[];
  featured?: boolean;
}
```

Generated files are saved to `src/types/generated/` and match the actual Content API structure.

## Project Structure

```
src/
├── mcp/             # MCP server implementation
│   ├── server.ts    # Main MCP server
│   ├── tools.ts     # MCP tools (actions)
│   └── resources.ts # MCP resources (data access)
├── routes/          # Express route handlers
│   ├── models.ts    # Model CRUD operations
│   ├── content.ts   # Content CRUD operations
│   ├── upload.ts    # Media upload
│   └── types.ts     # TypeScript interface generator
├── services/        # Builder.io API clients
│   ├── builderAdmin.ts    # Admin API GraphQL client
│   ├── builderContent.ts  # Content API client
│   ├── builderWrite.ts    # Write API client
│   └── builderUpload.ts   # Upload API client
├── types/           # TypeScript definitions
│   ├── index.ts     # Common types
│   └── generated/   # Auto-generated model interfaces
├── utils/           # Helper utilities
│   ├── logger.ts    # Simple logging
│   └── validation.ts # Basic validation helpers
└── app.ts           # Express app setup
```

## Development

### Scripts
- `npm run dev` - REST API development mode with hot reload
- `npm run dev:mcp` - MCP development mode with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run REST API production build
- `npm run start:mcp` - Run MCP production build
- `npm run type-check` - TypeScript type checking

### Logging
All API requests and responses are logged with status codes for easy debugging. Set `NODE_ENV=development` for debug logs.

## Security Notes

- Private API key is required for write operations
- File upload size limited to 50MB
- Only common media types are allowed for uploads
- Input validation on all endpoints

## Integration with Qwik

1. Generate TypeScript interfaces: `GET /generate-types`
2. Copy generated interfaces to your Qwik project
3. Use the Content API to fetch data in your Qwik routes
4. Upload media through the Upload API

This MCP is designed to be simple, secure, and pragmatic - perfect for headless CMS integration with your Qwik frontend.
