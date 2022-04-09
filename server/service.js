import fs from 'fs';
import { join, extname } from 'path';
import config from './config.js';
import fsPromises from 'fs/promises'
import { type } from 'os';

const { dir: { publicDirectory } } = config;

export class Service {
    createFileStream(filename) {
        return fs.createFileStream(filename)
    }

    async getFileInfo(file) {
        //file = home/index.html
        const fullFilePath = join(publicDirectory, file);
        // valida se existe, se não existe estoura um erro.
        await fsPromises.access(fullFilePath);
        const fileType = extname(fullFilePath);

        return {
            type: fileType,
            name: fullFilePath
        }

    }

    async getFileStream(file) {
        const { 
            name,
            type
        } = await this.getFileInfo(file)

        return {
            stream: this.createFileStream(name),
           
        }
    }
}