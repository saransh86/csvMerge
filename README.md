## CSV MERGE

### This code allows you to merge 2 csv files that have a common column in both. 

* If the 2 csv files have a common column, both will be merged to a single row.
* If one file has a row with a common column and the other does not, then the row will be created with non empty values from the csv file with valid columns and empty values from the empty file.

### How to run to code

* Install node: https://nodejs.org/en/download (This code is run on Node 18)
* Clone this repository
* cd into the root directory
* Run `npm install`
* To run the code: `node main.js`
* To run tests: `npm test`
* By default, it picks up 2 tests files in the files directory. 
* Change the location of the files in the main.js. Use relative paths.