import fs from 'fs';

import path from 'path';
import { fileURLToPath } from 'url';

export class csvMerge {
    
    constructor(filePath1, filePath2, key, outputPath){

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        this.filePath1 = __dirname + filePath1;
        this.filePath2 = __dirname + filePath2;
        this.key = key;
        this.outputPath = __dirname + outputPath;
    }

    run(){
        let file1 = this.getFileContent(this.filePath1);
        let file2 = this.getFileContent(this.filePath2);
        let headerOne = this.getHeaders(file1[0], this.key);
        let headerTwo = this.getHeaders(file2[0], this.key);

        /**
         * Create the output file with the headers
         */
        this.createFile(headerOne, headerTwo, this.outputPath, this.key);

        /**
         * Get the index of the key for the both arrays (csv files for each line)
         */
        let index1 = this.getIndex(file1[0], this.key);
        let index2 = this.getIndex(file2[0], this.key);

        /**
         *  create the csv to hash datastructure 
         */
        let res1 = this.fileToHash(file1, index1);
        let res2 = this.fileToHash(file2, index2);

        // console.log(res1, res2);
        let ans = {};
        let keys1 = Object.keys(res1);
        /**
             * Take the keys of 1 and check 2
             */
        for(let i=0; i<keys1.length;i++){
            if(keys1[i] in res2){
                // console.log("Found common: ", res1[keys1[i]], res2[keys1[i]]);
                ans[keys1[i]] = res1[keys1[i]].join(",") + "," + keys1[i] + "," + res2[keys1[i]].join(","); 
            }
            else{
                // console.log("Not common",res1[keys1[i]], res2[keys1[i]] );
                let temp = [];
                temp.length = headerTwo.length;
                ans[keys1[i]] = res1[keys1[i]].join(",") + "," + keys1[i] + "," + temp.join(",");
            }
        }

        /**
         * Take the keys of 2 and check ans, the ones not found are the ones we need to add
         */

        let keys2 = Object.keys(res2);
        for(let i=0;i<keys2.length;i++){
            if(!(keys2[i] in ans)){
                let temp = [];
                temp.length = headerOne.length;
                ans[keys2[i]] = temp.join(",") + "," + keys2[i] + "," + res2[keys2[i]].join(",");
            }
        }       
        // console.log(ans);
        this.writeFile(ans,this.outputPath);
        console.log("Combined csv created!");
    }

    fileToHash(rows, index){
        let res = {};
        for(let i=1;i<rows.length;i++){
            let vals = rows[i].split(",");
            res[vals.splice(index, 1)] = vals;
        }
        return res;
    }
    
    getFileContent(filePath){
       
        /**
         * This should be the relative filepath name
         */
        try{
            let fileContent = fs.readFileSync(filePath, 'utf-8');
            return fileContent.split("\n");
        }
        catch(e){
            throw new Error(e);
        }
        
    }
    
    createFile(headerOne, headerTwo, outputFile, key){
        try{
            fs.writeFileSync(outputFile, headerOne.join(",") + "," + key + "," + headerTwo.join(","));
        }
        catch(e){
            throw new Error(e);
        }
        
    }
    
    getHeaders(firstLine, key){
        try{
            if(firstLine.length === 0){
                throw new Error("Cannot get header from line");
            }
            let header = firstLine.split(",");
            let index = header.indexOf(key);
            if(index > -1){
                header.splice(index, 1);
            }
            return header;
        }
        catch(err){
            throw new Error(err.message);
        }
        
    }
    
    writeFile(hash, outputFile){
        try{
            let keys = Object.keys(hash);
            for(let i=0; i<keys.length;i++){
                fs.appendFileSync(outputFile, "\n" + hash[keys[i]]);
            }
        }
        catch(e){
            throw new Error("Cannot write to file");
        }
    }
    
    getIndex(firstLine, key){
        let header = firstLine.split(",");
        return header.indexOf(key);
    }


}