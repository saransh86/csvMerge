import {csvMerge} from '../csvMerge.js';
import {jest} from '@jest/globals';
import fs from 'fs';
describe("csv merge test methods", () => {

    let file1;
    let file2;
    beforeEach(() => {
        
        file1 = fs.openSync('./testFiles/file1.csv', "w");
        file2 = fs.openSync('./testFiles/file2.csv', "w");
    })

    afterEach(() => {
        fs.unlinkSync('./testFiles/file1.csv');
        fs.unlinkSync('./testFiles/file2.csv');
        fs.unlinkSync('./testFiles/result.csv');

    })

    test("Merge empty csv files", () => {
        
        let csv = new csvMerge("/../testFiles/file1.csv", "/../testFiles/file2.csv","location", "/../testFiles/result.csv");
        fs.appendFileSync(file1,"name,age,location");
        fs.appendFileSync(file2, "car,location");
        csv.run();
        let res = fs.readFileSync("./testFiles/result.csv", 'utf-8');
        expect(res).toBe("name,age,location,car");
         
    });

    test("Test merge csv with file2 empty", () => {
        let csv = new csvMerge("/../testFiles/file1.csv", "/../testFiles/file2.csv","location", "/../testFiles/result.csv");
        fs.appendFileSync(file1,"name,age,location");
        fs.appendFileSync(file1, "\nSaransh,35,Chicago");
        fs.appendFileSync(file2, "car,location");
        csv.run();
        let res = fs.readFileSync("./testFiles/result.csv", 'utf-8');
        expect(res).toBe("name,age,location,car\nSaransh,35,Chicago,");
    })

    test("Test Merge csv with file1 empty ", () => {
        let csv = new csvMerge("/../testFiles/file1.csv", "/../testFiles/file2.csv","location", "/../testFiles/result.csv");
        fs.appendFileSync(file1,"name,age,location");
        fs.appendFileSync(file2, "car,location");
        fs.appendFileSync(file2, "\nAudi,Chicago")
        csv.run();
        let res = fs.readFileSync("./testFiles/result.csv", 'utf-8');
        expect(res).toBe("name,age,location,car\n,,Chicago,Audi");
    })

    test("Test Merge csv with non empty files", () => {
        let csv = new csvMerge("/../testFiles/file1.csv", "/../testFiles/file2.csv","location", "/../testFiles/result.csv");
        fs.appendFileSync(file1,"name,age,location");
        fs.appendFileSync(file1, "\nSaransh,35,Chicago");
        fs.appendFileSync(file2, "car,location");
        fs.appendFileSync(file2, "\nAudi,Chicago")
        csv.run();
        let res = fs.readFileSync("./testFiles/result.csv", 'utf-8');
        expect(res).toBe("name,age,location,car\nSaransh,35,Chicago,Audi");
    })
});