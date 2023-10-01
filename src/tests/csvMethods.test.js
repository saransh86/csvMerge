

import {csvMerge} from '../csvMerge.js';
import {jest} from '@jest/globals';
import fs from 'fs';


describe("csv merge test methods", () => {

    let fsMock;


    test("Test get file contents of empty file", () => {
        try{
            let csv = new csvMerge("./file1.csv", "./file2.csv","age", "");
            csv.getFileContent("");
        }
        catch(e){
            expect(e.message).toBe('Error: ENOENT: no such file or directory, open');
        }
    });

    test("Test get file contents of valid file", () => {
        fsMock = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('test1\ntest2');
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "");
        let res = csv.getFileContent("./file1.csv");
        expect(res).toStrictEqual(["test1", "test2"]);
        fsMock.mockRestore();
    })

    test("Test get file content from a single file", () => {
        fsMock = jest.spyOn(fs, 'readFileSync').mockReturnValueOnce('test1');
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "");
        let res = csv.getFileContent("./file1.csv");
        expect(res).toStrictEqual(["test1"]);
        fsMock.mockRestore();
    })

    test("Test get header from first line", () => {
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let res = csv.getHeaders("name,age,location", "name");
        expect(res).toStrictEqual(['age', 'location']);
    })
    
    test("Test get header from first line with invalid key column", () => {
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let res = csv.getHeaders("name,age,location", "ssn");
        expect(res).toStrictEqual(['name', 'age', 'location']);
    })
  
    test("Test get header from invalid line", () => {
        try{
            let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
            let res = csv.getHeaders("", "ssn");
            expect(res).toStrictEqual(['name', 'age', 'location']);
        }
        catch(e){
            expect(e.message).toBe("Cannot get header from line");
        }
    })

    test("Test write file result to output file", () => {
        
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let hash = {'1': ',,1,BMW,M3,1300'};
        fsMock = jest.spyOn(fs, 'appendFileSync').mockReturnValue(undefined);
        let res = csv.writeFile(hash, "result.csv");
        expect(fsMock).toHaveBeenCalledTimes(1)
        fsMock.mockRestore();
    })

    test("Test write file with invalid file path", () => {
        try{
            let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
            let hash = {'1': ',,1,BMW,M3,1300'};
            let res = csv.writeFile(hash, "");
            expect(fsMock).toHaveBeenCalledTimes(0)
            // fsMock.mockRestore();
        }
        catch(e){
            expect(e.message).toBe('Cannot write to file');
        }
    })

    test("Test get index of join column from header", () => {
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let firstLine = 'name,age,location';
        let res = csv.getIndex(firstLine, 'age');
        expect(res).toBe(1);
    })

    test("Test get index of non existant column from header", () => {
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let firstLine = 'name,age,location';
        let res = csv.getIndex(firstLine, 'city');
        expect(res).toBe(-1);
    })

    test("Test create file with valid path", () => {
        let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
        let header1 = ['name'];
        let header2 = ['location'];
        fsMock = jest.spyOn(fs, 'writeFileSync').mockReturnValue(undefined);
        let res = csv.createFile(header1, header2, "./result.csv" ,"age");
        expect(fsMock).toHaveBeenCalledTimes(1);
        fsMock.mockRestore();
    })


    test("Test create file with invalid output path", () => {
       try{
            let csv = new csvMerge("./file1.csv", "./file2.csv","age", "result.csv");
            let header1 = ['name'];
            let header2 = ['location', "ssn"];
           
            let res = csv.createFile(header1, header2, "" ,"age");
            console.log(res);
        }
        catch(e){
            expect(e.message).toBe("Error: ENOENT: no such file or directory, open");
        }
    })
  });