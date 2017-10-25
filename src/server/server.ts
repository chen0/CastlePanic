import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as path from 'path';
import {serverConfig} from './database/dbConfig';

export interface ServerConfig {
    port: number;
}

/**
 * The Server object manages the express.js server. This server will serve all files in public/
 *
 * @class Server
 */
class Server {

    public static port;

    private express: express.Application;
    private router: express.Router;

    private server: any;

    constructor() {
        Server.port = serverConfig.port;
        
        this.express = express();
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(bodyParser.json());
        this.express.use('/', express.static( path.join(__dirname, '/public') ) );

        this.router = express.Router();
        this.express.use('/', this.router);
    }

    /**
     * Gets the express router from the server so that you can add new routes to the server.
     *
     * @returns {express.Router}
     * @memberof Server
     */
    public getRouter(): express.Router {
        return this.router;
    }

    /**
     * Starts the express server on port
     *
     * @memberof Server
     */
    public start(): void {
        this.server = this.express.listen( Server.port, () => {
            console.info(`Server running at http://127.0.0.1:${Server.port}`);
        });
    }

    /**
     * Starts the express server on port, and calls a callback function after server is running
     * @param callback
     */
    public startAsync(callback: () => void) {
        this.server = this.express.listen( Server.port, () => {
            callback();
        });
    }

    /**
     * Stops the server
     * 
     * @memberof Server
     */
    public stop(): void {
        this.server.close();
    }
}

export default new Server();
