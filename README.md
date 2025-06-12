# Builder.io MCP Server

A secure, well-structured MCP (Model–Context–Processor) server for interfacing with the Builder.io Admin and Content APIs. This server provides TypeScript interface generation, content management, and comprehensive context for AI development tools like Augment.

## 🚀 Features

- **TypeScript Interface Generation**: Auto-generate TypeScript interfaces from Builder.io model schemas
- **Content Management**: Full CRUD operations for Builder.io content entries
- **Augment AI Integration**: Provide contextual data for AI-powered development tools
- **Web Scraping**: Optional manufacturer website scraping to populate content
- **RESTful API**: Clean, well-documented endpoints with comprehensive validation
- **Security**: Rate limiting, authentication, input validation, and security headers
- **Extensible**: Modular architecture for easy feature additions

## 📋 Requirements

- Node.js 18.0.0 or higher
- Builder.io account with API keys
- TypeScript knowledge for generated interfaces

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd builder-mcp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   BUILDER_PUBLIC_API_KEY=your_builder_public_api_key_here
   BUILDER_PRIVATE_API_KEY=your_builder_private_api_key_here
   PORT=3000
   NODE_ENV=development
   FRONTEND_PATH=../your-frontend-project
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## 🚦 Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Generate TypeScript Interfaces
```bash
# Generate for all models
npm run generate:types

# Generate for specific models
npm run generate:types -- --models model1,model2

# Custom output directory
npm run generate:types -- --output ./src/types
```

### Push Content from Files
```bash
# Push content from JSON file
npm run push:content -- --file content.json --model my-model-id

# Publish immediately
npm run push:content -- --file content.json --model my-model-id --publish

# Dry run (preview changes)
npm run push:content -- --file content.json --model my-model-id --dry-run
```

## 📚 API Documentation

### Authentication

All endpoints require authentication via API key:

**Header**: `X-API-Key: your_builder_api_key`  
**Query Parameter**: `?apiKey=your_builder_api_key`

### Core Endpoints

#### Models
- `GET /models` - Fetch all Builder.io models
- `GET /models/:model` - Fetch specific model
- `POST /models` - Create new model
- `PUT /models/:model` - Update model
- `DELETE /models/:model` - Delete model
- `GET /models/:model/schema` - Get JSON schema for model

#### Content
- `GET /content/:model` - Get content entries for model
- `GET /content/:model/:id` - Get specific content entry
- `POST /content/:model` - Create content entry
- `PUT /content/:model/:id` - Update content entry
- `DELETE /content/:model/:id` - Delete content entry
- `POST /content/:model/:id/publish` - Publish content
- `POST /content/:model/:id/unpublish` - Unpublish content
- `POST /content/:model/bulk` - Bulk create/update entries

#### TypeScript Generation
- `GET /generate-types` - Generate TypeScript interfaces
- `GET /generate-types/:model` - Generate interface for specific model
- `GET /download-types` - Download all generated types
- `GET /download-types/:filename` - Download specific type file
- `POST /validate-types` - Validate generated interfaces
- `DELETE /types` - Clear generated types

#### Augment Context
- `GET /augment-context` - Get comprehensive context for AI
- `GET /augment-context/models` - Get context for specific models
- `GET /augment-context/frontend` - Get frontend file structure
- `POST /augment-context/search` - Search across codebase
- `GET /augment-context/summary` - Get quick summary
- `POST /augment-context/refresh` - Force refresh context

### Example Requests

#### Create a Model
```bash
curl -X POST http://localhost:3000/models \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product",
    "kind": "data",
    "fields": [
      {
        "name": "title",
        "type": "text",
        "required": true
      },
      {
        "name": "price",
        "type": "number",
        "required": true
      }
    ]
  }'
```

#### Create Content
```bash
curl -X POST http://localhost:3000/content/product-model-id \
  -H "X-API-Key: your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "data": {
      "title": "iPhone 15",
      "price": 999
    },
    "published": "draft"
  }'
```

#### Generate Types
```bash
curl -X GET http://localhost:3000/generate-types \
  -H "X-API-Key: your_api_key"
```

## 🏗️ Project Structure

```
builder-mcp/
├── src/
│   ├── builder/          # Builder.io API clients
│   ├── types/            # TypeScript generation
│   ├── augment/          # Augment AI context
│   ├── scraper/          # Web scraping utilities
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   ├── utils/            # Utility functions
│   ├── scripts/          # CLI scripts
│   ├── app.ts            # Express app setup
│   └── server.ts         # Server entry point
├── tests/                # Test files
├── generated/            # Generated TypeScript files
├── logs/                 # Application logs
└── docs/                 # Additional documentation
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Comprehensive request validation using Joi
- **Security Headers**: Helmet.js for security headers
- **CORS**: Configurable CORS policies
- **Authentication**: API key-based authentication
- **Error Handling**: Secure error responses without information leakage

## 🚀 Deployment

### Docker (Recommended)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

### Environment Variables for Production
```env
NODE_ENV=production
PORT=3000
BUILDER_PUBLIC_API_KEY=your_production_public_key
BUILDER_PRIVATE_API_KEY=your_production_private_key
JWT_SECRET=your_secure_jwt_secret
LOG_LEVEL=info
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BUILDER_PUBLIC_API_KEY` | Builder.io public API key | Required |
| `BUILDER_PRIVATE_API_KEY` | Builder.io private API key | Required |
| `PORT` | Server port | 3000 |
| `NODE_ENV` | Environment | development |
| `FRONTEND_PATH` | Path to frontend codebase | ../frontend |
| `LOG_LEVEL` | Logging level | info |
| `API_RATE_LIMIT_MAX_REQUESTS` | Rate limit max requests | 100 |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the `/docs` directory for detailed guides
- **Issues**: Report bugs and request features via GitHub Issues
- **Builder.io Docs**: https://www.builder.io/c/docs

## 🗺️ Roadmap

- [ ] GraphQL API support
- [ ] Real-time content synchronization
- [ ] Advanced web scraping with AI
- [ ] Content versioning and rollback
- [ ] Multi-tenant support
- [ ] Performance monitoring and analytics
- [ ] Automated content migration tools
