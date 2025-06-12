import fs from 'fs';
import path from 'path';
import config from '@/utils/config';
import logger from '@/utils/logger';

export interface FileInfo {
  path: string;
  name: string;
  extension: string;
  size: number;
  type: 'file' | 'directory';
  lastModified: Date;
  relativePath: string;
}

export interface DirectoryStructure {
  name: string;
  path: string;
  type: 'directory';
  children: (FileInfo | DirectoryStructure)[];
  fileCount: number;
  totalSize: number;
}

export interface FrontendFileMap {
  rootPath: string;
  structure: DirectoryStructure;
  summary: {
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
    fileTypes: Record<string, number>;
    lastScanned: Date;
  };
  components: FileInfo[];
  pages: FileInfo[];
  types: FileInfo[];
  configs: FileInfo[];
  assets: FileInfo[];
}

export class FrontendFileMapper {
  private readonly frontendPath: string;
  private readonly excludePatterns: RegExp[];
  private readonly includeExtensions: Set<string>;

  constructor(frontendPath?: string) {
    this.frontendPath = frontendPath || config.frontendPath;
    this.excludePatterns = [
      /node_modules/,
      /\.git/,
      /\.next/,
      /\.nuxt/,
      /dist/,
      /build/,
      /coverage/,
      /\.cache/,
      /\.temp/,
      /\.tmp/,
      /\.DS_Store/,
      /Thumbs\.db/,
    ];
    this.includeExtensions = new Set([
      '.js', '.jsx', '.ts', '.tsx', '.vue', '.svelte',
      '.json', '.md', '.mdx', '.css', '.scss', '.sass',
      '.less', '.styl', '.html', '.htm', '.xml',
      '.yaml', '.yml', '.toml', '.env', '.config.js',
      '.config.ts', '.config.json'
    ]);
  }

  /**
   * Generate complete frontend file map
   */
  async generateFileMap(): Promise<FrontendFileMap> {
    logger.info('Generating frontend file map', { frontendPath: this.frontendPath });

    if (!fs.existsSync(this.frontendPath)) {
      throw new Error(`Frontend path does not exist: ${this.frontendPath}`);
    }

    const structure = await this.scanDirectory(this.frontendPath);
    const allFiles = this.flattenStructure(structure);

    const fileMap: FrontendFileMap = {
      rootPath: this.frontendPath,
      structure,
      summary: {
        totalFiles: allFiles.filter(f => f.type === 'file').length,
        totalDirectories: allFiles.filter(f => f.type === 'directory').length,
        totalSize: allFiles.reduce((sum, f) => sum + (f.size || 0), 0),
        fileTypes: this.getFileTypeStats(allFiles),
        lastScanned: new Date(),
      },
      components: this.categorizeFiles(allFiles, 'components'),
      pages: this.categorizeFiles(allFiles, 'pages'),
      types: this.categorizeFiles(allFiles, 'types'),
      configs: this.categorizeFiles(allFiles, 'configs'),
      assets: this.categorizeFiles(allFiles, 'assets'),
    };

    logger.info('Frontend file map generated', {
      totalFiles: fileMap.summary.totalFiles,
      totalDirectories: fileMap.summary.totalDirectories,
      totalSize: fileMap.summary.totalSize,
    });

    return fileMap;
  }

  /**
   * Scan directory recursively
   */
  private async scanDirectory(dirPath: string, relativePath: string = ''): Promise<DirectoryStructure> {
    const items = fs.readdirSync(dirPath);
    const children: (FileInfo | DirectoryStructure)[] = [];
    let fileCount = 0;
    let totalSize = 0;

    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const itemRelativePath = path.join(relativePath, item);

      // Skip excluded patterns
      if (this.shouldExclude(itemRelativePath)) {
        continue;
      }

      const stats = fs.statSync(fullPath);

      if (stats.isDirectory()) {
        const subDir = await this.scanDirectory(fullPath, itemRelativePath);
        children.push(subDir);
        fileCount += subDir.fileCount;
        totalSize += subDir.totalSize;
      } else if (stats.isFile() && this.shouldIncludeFile(item)) {
        const fileInfo: FileInfo = {
          path: fullPath,
          name: item,
          extension: path.extname(item),
          size: stats.size,
          type: 'file',
          lastModified: stats.mtime,
          relativePath: itemRelativePath,
        };
        children.push(fileInfo);
        fileCount++;
        totalSize += stats.size;
      }
    }

    return {
      name: path.basename(dirPath),
      path: dirPath,
      type: 'directory',
      children,
      fileCount,
      totalSize,
    };
  }

  /**
   * Check if path should be excluded
   */
  private shouldExclude(relativePath: string): boolean {
    return this.excludePatterns.some(pattern => pattern.test(relativePath));
  }

  /**
   * Check if file should be included based on extension
   */
  private shouldIncludeFile(fileName: string): boolean {
    const extension = path.extname(fileName).toLowerCase();
    return this.includeExtensions.has(extension);
  }

  /**
   * Flatten directory structure to array of files
   */
  private flattenStructure(structure: DirectoryStructure): FileInfo[] {
    const files: FileInfo[] = [];

    for (const child of structure.children) {
      if (child.type === 'file') {
        files.push(child as FileInfo);
      } else {
        files.push(...this.flattenStructure(child as DirectoryStructure));
      }
    }

    return files;
  }

  /**
   * Get file type statistics
   */
  private getFileTypeStats(files: FileInfo[]): Record<string, number> {
    const stats: Record<string, number> = {};

    for (const file of files) {
      if (file.type === 'file') {
        const ext = file.extension.toLowerCase();
        stats[ext] = (stats[ext] || 0) + 1;
      }
    }

    return stats;
  }

  /**
   * Categorize files by type
   */
  private categorizeFiles(files: FileInfo[], category: string): FileInfo[] {
    const patterns = {
      components: [
        /\/components?\//i,
        /\/ui\//i,
        /\/widgets?\//i,
        /\.component\./i,
        /\.widget\./i,
      ],
      pages: [
        /\/pages?\//i,
        /\/routes?\//i,
        /\/views?\//i,
        /\/screens?\//i,
        /\.page\./i,
        /\.route\./i,
      ],
      types: [
        /\/types?\//i,
        /\/interfaces?\//i,
        /\/models?\//i,
        /\.types?\./i,
        /\.interface\./i,
        /\.d\.ts$/i,
      ],
      configs: [
        /config/i,
        /\.config\./i,
        /\.env/i,
        /package\.json$/i,
        /tsconfig/i,
        /webpack/i,
        /vite/i,
        /next\.config/i,
        /nuxt\.config/i,
      ],
      assets: [
        /\/assets?\//i,
        /\/static/i,
        /\/public/i,
        /\/images?\//i,
        /\/icons?\//i,
        /\/fonts?\//i,
        /\.(png|jpg|jpeg|gif|svg|ico|webp)$/i,
        /\.(woff|woff2|ttf|eot)$/i,
      ],
    };

    const categoryPatterns = patterns[category as keyof typeof patterns] || [];

    return files.filter(file => {
      if (file.type !== 'file') return false;
      
      return categoryPatterns.some(pattern => 
        pattern.test(file.relativePath) || pattern.test(file.name)
      );
    });
  }

  /**
   * Get file content for specific files (useful for Augment context)
   */
  async getFileContents(filePaths: string[]): Promise<Record<string, string>> {
    const contents: Record<string, string> = {};

    for (const filePath of filePaths) {
      try {
        const fullPath = path.isAbsolute(filePath) 
          ? filePath 
          : path.join(this.frontendPath, filePath);

        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          contents[filePath] = content;
        }
      } catch (error) {
        logger.warn(`Failed to read file: ${filePath}`, error);
      }
    }

    return contents;
  }

  /**
   * Search for files by pattern
   */
  searchFiles(pattern: string | RegExp, files?: FileInfo[]): FileInfo[] {
    const searchIn = files || [];
    const regex = typeof pattern === 'string' ? new RegExp(pattern, 'i') : pattern;

    return searchIn.filter(file => 
      regex.test(file.name) || regex.test(file.relativePath)
    );
  }

  /**
   * Get recently modified files
   */
  getRecentlyModified(files: FileInfo[], hours: number = 24): FileInfo[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    
    return files
      .filter(file => file.type === 'file' && file.lastModified > cutoff)
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime());
  }
}

// Export singleton instance
export const frontendFileMapper = new FrontendFileMapper();
