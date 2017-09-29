import * as http from 'http';
import * as _ from 'lodash';
import { Api } from '../api';
import Server from '../server';
import { AsyncTester } from './asyncTester';

export class ApiTest {

    private tester: AsyncTester;

    constructor(callback: () => void) {
        this.tester = new AsyncTester(this, callback);

        // Testcases related to /api/newGame
        this.tester.add(this.createSession);
        this.tester.add(this.createSession_Name);

        // Testcases related to /api/joinGame
        this.tester.add(this.joinSession);
        this.tester.add(this.joinSession_missingName);
        this.tester.add(this.joinSession_uniqueNames);

        console.info('API Tests\n');
        this.tester.start();
    }

    /**
     * Sends inputData to an api endpoint via a http request and returns the results via the callback function
     * 
     * @private
     * @param {string} endpoint  - api endpoint to send request to
     * @param {*} inputData      - json data to send to the server
     * @param {(data: any) => void} callback - called with data recieved from response
     * @memberof ApiTest
     */
    private testApi(endpoint: string, inputData: any, callback: (data: any) => void) {
        let api = new Api();
        let body = JSON.stringify(inputData);
        let connectOptions = {
            host: 'localhost',
            port: 8000,
            path: endpoint,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(body)
            }
        };
        Server.startAsync(() => {
            let req = http.request(connectOptions, (res) => {
                res.setEncoding('utf8');
                res.on('data', (chunk: string) => {
                    Server.stop();
                    callback(JSON.parse(chunk));
                });
            });
            req.end(body);
        });
    }

    /**
     * Tests if you recieve a gameCode after calling /api/newGame
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof ApiTest
     */
    private createSession(tester: AsyncTester) {
        tester.ref.testApi('/api/newGame', {}, (data: any) => {
            let code = _.get(data, 'gameCode', '');
            let result: boolean = true;
            if (_.isEqual(code, '')) {
                result = false;
            } else {
                result = true;
            }
            AsyncTester.result(tester, 'create session (empty parameters)', result);
        });
    }

    /**
     * Tests if you can send a name when requesting a new game
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof ApiTest
     */
    private createSession_Name(tester: AsyncTester) {
        let input = {
            name: 'testName'
        };
        tester.ref.testApi('/api/newGame', input, (data: any) => {
            let code = _.get(data, 'gameCode', '');
            let result: boolean = true;
            if (_.isEqual(code, '')) {
                result = false;
            } else {
                result = true;
            }
            AsyncTester.result(tester, 'create session with name', result);
        });
    }

    /**
     * Tests if a user can join a newly created game
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof ApiTest
     */
    private joinSession(tester: AsyncTester) {
        tester.ref.testApi('/api/newGame', {}, (newGameData: any) => {
            let gameCode = _.get(newGameData, 'gameCode', '');
            let input = {
                gameCode,
                name: 'testName'
            };
            tester.ref.testApi('/api/joinGame', input, (joinGameData: any) => {
                let result = _.get(joinGameData, 'success');
                AsyncTester.result(tester, 'join session', _.isEqual(result, true));
            });
        });
    }

    /**
     * Tests if server returns success=false if request to /api/joinGame is missing a name
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof ApiTest
     */
    private joinSession_missingName(tester: AsyncTester) {
        tester.ref.testApi('/api/newGame', {}, (newGameData: any) => {
            let gameCode = _.get(newGameData, 'gameCode', '');
            let input = {
                gameCode
            };
            tester.ref.testApi('/api/joinGame', input, (joinGameData: any) => {
                let result = _.get(joinGameData, 'success');
                AsyncTester.result(tester, 'join session (missing name)', _.isEqual(result, false));
            });
        });
    }

    /**
     * Tests if a user can join a game with a name that a user has already choosen
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof ApiTest
     */
    private joinSession_uniqueNames(tester: AsyncTester) {
        let input1  = { name: 'testName' };
        tester.ref.testApi('/api/newGame', input1, (newGameData: any) => {
            let gameCode = _.get(newGameData, 'gameCode', '');
            let input2 = {
                gameCode,
                name: 'testName'
            };
            tester.ref.testApi('/api/joinGame', input2, (joinGameData: any) => {
                let success: boolean = _.get(joinGameData, 'success');
                let error: string = _.get(joinGameData, 'error', '');

                let pass: boolean = success && ( _.isEqual(error, 'name already exists') );
                AsyncTester.result(tester, 'join session (duplicate names)', pass);
            });
        });
    }

}
