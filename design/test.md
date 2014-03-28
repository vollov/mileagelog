#Test Strategy

##Test prototype 1 (test-0.1)
Unit Test in local and End to end test via http
When test, test against app_name_test database

For e2e test and local test, the database name are loaded via config.js file.
See tag test-0.1 for implementation detail.

##Test prototype 2 (test-0.2)
* unit test and e2e test should run separately.
* unit test should run only once, because it is wrapper code.
* when running unit test, db name will be hard coded, and there is a code sync between test and prod code.

