
export class AsyncTester {

    /**
     * Displays the result of the test case and starts the next test case
     * 
     * @static
     * @param {AsyncTester} tester 
     * @param {string} title 
     * @param {boolean} status 
     * @memberof AsyncTester
     */
    public static result(tester: AsyncTester, title: string, status: boolean) {
        console.info(`${title}: ${status ? '\x1b[32m Passed' : '\x1b[31m Failed'}\x1b[0m`);
        if (tester.testIndex < tester.tests.length - 1 ) {
            tester.testIndex++;
            tester.tests[ tester.testIndex ](tester);
        } else {
            tester.callback();
        }
    }

    // array of test cases to run, each function must accept a AsyncTester
    public tests: Array<( tester: AsyncTester ) => void>;
    // reference back to the object that is doing the testing
    public ref: any;
    // current test case
    public testIndex: number;
    // function to call after all test cases have been evaluated
    public callback: () => void;
    
    /**
     * Creates an instance of AsyncTester.
     * @param {*} ref               - should be a reference to the object calling the tester
     * @param {()=> void} callback  - function to call after all tests are complete
     * @memberof AsyncTester
     */
    constructor( ref: any, callback: () => void ) {
        this.callback = callback;
        this.testIndex = 0;
        this.tests = [];
        this.ref = ref;
    }

    /**
     * Starts running the test cases
     * 
     * @memberof AsyncTester
     */
    public start() {
        this.tests[0](this);
    }

    /**
     * Adds the function as a testcase. The function should accept a AsyncTester object and
     * it must all the result function to display the results and continue the test cases
     * 
     * @param {(tester: AsyncTester ) => void} test 
     * @memberof AsyncTester
     */
    public add( test: (tester: AsyncTester ) => void ) {
        this.tests.push( test );
    }

}
