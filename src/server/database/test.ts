import {AsyncTester} from '../testing/asyncTester';
import {DBConnector} from './database';

export class DatabaseTest {

    private tester: AsyncTester;

    constructor(callback: () => void ) {
        this.tester = new AsyncTester(this, callback);

        // adding test cases to AsyncTester
        this.tester.add(this.connection);
        this.tester.add(this.games);
        this.tester.add(this.users);

        console.info('\nDatabase Tests\n');
        this.tester.start();
    }

    /**
     * Testing if a connection can be established with the database
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof DatabaseTest
     */
    private connection(tester: AsyncTester) {
        let db = new DBConnector();
        let str = 'SELECT 1+1 AS solution;';
        db.query(str, (err: any, rows: any, fields: any) => {
            db.close();
            let passed: boolean;
            if ( err ) {
                passed = false;
            } else {
                passed = true;
            }
            AsyncTester.result(tester, 'connection', passed);
        });
    }

    /**
     * Testing if the Games table is in the database
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof DatabaseTest
     */
    private games(tester: AsyncTester) {
        let db = new DBConnector();
        let str = 'SELECT code, created, state FROM Games;';
        db.query(str, (err: any, rows: any, fields: any) => {
            db.close();
            let passed: boolean;
            if ( err ) {
                passed = false;
            } else {
                passed = true;
            }
            AsyncTester.result(tester, 'Games table', passed);
        });
    }

    /**
     * Testing if the Users table is in the database
     * 
     * @private
     * @param {AsyncTester} tester 
     * @memberof DatabaseTest
     */
    private users(tester: AsyncTester) {
        let db = new DBConnector();
        let str = 'SELECT id, name, game_code, role FROM Users;';
        db.query(str, (err: any, rows: any, fields: any) => {
            db.close();
            let passed: boolean;
            if ( err ) {
                passed = false;
            } else {
                passed = true;
            }
            AsyncTester.result(tester, 'Users table', passed);
        });
    }

}
