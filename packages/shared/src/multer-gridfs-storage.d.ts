declare module "multer-gridfs-storage" {
  import { StorageEngine } from "multer";

  interface MulterGridfsStorageOptions {
    url: string;
    file?: (req: any, file: Express.Multer.File) => any;
    options?: any;
  }

  class GridFsStorage implements StorageEngine {
    constructor(config: MulterGridfsStorageOptions);
  }

  export = GridFsStorage;
}
