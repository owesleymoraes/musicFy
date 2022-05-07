import fs from 'fs';
import Throttle from 'throttle';
import {
    logger
} from './util.js';
import ChildProcess from 'child_process';
import {
    randomUUID
} from 'crypto';
import {
    PassThrough
} from 'stream';
import {
    join,
    extname
} from 'path';
import config from './config.js';
import fsPromises from 'fs/promises'
import Throttle from 'throttle';


const {
    dir: {
        publicDirectory
    },
    constants: {
        fallBackBitRate,
        englishConversation,
        bitRateDivisor
    }

} = config;

export class Service {

    constructor() {
        this.clientStreams = new Map();
        this.currentSong = englishConversation;
        this.currentBitRate = 0;
        this.throttleTransfor = {};
        this.currentReadable = {}
    }

    createClientStream() {
        const id = randomUUID();
        const clientStream = new PassThrough();
        this.clientStreams.set(id, clientStream);
        return {
            id,
            clientStream
        }

    }

    removeClientStream(id) {
        this.clientStreams.delete(id);
    }

    _executeSoxcommand(args) {
        ChildProcess.spawn('sox', args)
    }

    async getBitRate(song) {
        try {

            const args = [
                --i, // info
                -B, // bitrate
                song
            ]
            const {
                stderr, // tudo que é erro.
                stdout, // tudo que é log
                //stdin // enviar dados como stream

            } = this._executeSoxcommand(args);

            const [sucess, error] = [stdout, stderr].map(stream => stream.read());
            if (error) {
                return await Promise.reject(error)
            }


            return sucess.toString().trim().replace(/k/, 000)


        } catch (error) {
            logger.error(`deu erro no bitrate ${error}`);
            return fallBackBitRate;
        }

    }

    async startStream() {
        logger.info(`starting with ${this.currentSong}`);
        const bitRate = this.currentBitRate = (await this.getBitRate(this.currentSong)) / bitRateDivisor
        const throttleTransfor = this.throttleTransfor = new Throttle(bitRate);
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong);
    }

    createFileStream(filename) {
        return fs.createReadStream(filename)
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
            type

        }
    }
}