// Media upload routes

import { Router, Request, Response } from 'express';
import multer from 'multer';
import { BuilderUploadService } from '@/services/builderUpload';
import { BuilderConfig } from '@/types';
import { validateRequired, validateUrl } from '@/utils/validation';
import { Logger } from '@/utils/logger';

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow common media types
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/webm',
      'audio/mp3',
      'audio/wav',
      'application/pdf',
      'text/plain',
      'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  }
});

export function createUploadRouter(config: BuilderConfig): Router {
  const router = Router();
  const uploadService = new BuilderUploadService(config);

  // POST / - Upload file
  router.post('/', upload.single('file'), async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file provided'
        });
        return;
      }

      const { folder, metadata } = req.body;
      const options: any = {};

      if (folder) {
        options.folder = folder;
      }

      if (metadata) {
        try {
          options.metadata = JSON.parse(metadata);
        } catch (e) {
          res.status(400).json({
            success: false,
            error: 'Invalid metadata JSON'
          });
          return;
        }
      }

      Logger.info(`Uploading file: ${req.file.originalname} (${req.file.size} bytes)`);
      const result = await uploadService.uploadFile(
        req.file.buffer,
        req.file.originalname,
        options
      );

      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error uploading file', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // POST /url - Upload from URL
  router.post('/url', async (req: Request, res: Response) => {
    try {
      const { url, filename, folder, metadata } = req.body;

      validateUrl(url);
      
      const options: any = {};
      if (filename) options.filename = filename;
      if (folder) options.folder = folder;
      if (metadata) options.metadata = metadata;

      Logger.info(`Uploading from URL: ${url}`);
      const result = await uploadService.uploadFromUrl(url, options);

      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error uploading from URL', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // GET /:id - Get file info
  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      validateRequired(id, 'File ID');

      Logger.info(`Getting file info: ${id}`);
      const result = await uploadService.getFileInfo(id);

      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error getting file info', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  // DELETE /:id - Delete file
  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      validateRequired(id, 'File ID');

      Logger.info(`Deleting file: ${id}`);
      const result = await uploadService.deleteFile(id);

      if (result.success) {
        res.status(result.status).json({
          success: true,
          data: result.data
        });
      } else {
        res.status(result.status).json({
          success: false,
          error: result.error
        });
      }
    } catch (error: any) {
      Logger.error('Error deleting file', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  });

  return router;
}
