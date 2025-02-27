import { Request } from "express-serve-static-core";
import fs from "fs";

// Extend the Request interface to include Multer file types
interface MulterRequest extends Request {
  file?: Express.Multer.File;
  // files?: { [fieldname: string]: Express.Multer.File[] };
}
export const getStaticFilePath = (req: Request, fileName: string) => {
  return `${req.protocol}://${req.get("host")}/uploads/${fileName}`;
};
export const getLocalPath = (filename: string) => {
  return `public/uploads/${filename}`;
};

export const removeLocalFile = (localPath: string) => {
  fs.unlink(localPath, (err) => {
    if (err) {
      console.log("Error removing local file: " + err);
    }
    console.log("removed localthat: " + localPath);
  });
};

export const removeUnusedMulterImageFilesOnError = (request: Request) => {
  const req = request as MulterRequest;
  const multerFile = req.file;
  const multerFiles = req.files;
  if (multerFile) {
    removeLocalFile(multerFile.path);
  }
  if (multerFiles) {
    const filesValueArray = Object.values(multerFiles);
    filesValueArray.map((fileObject) => {
      // fileFields.map((fileObject) => {
      removeLocalFile(fileObject.path);
      // });
    });
  }
};
