import { csvMerge } from './csvMerge.js';


(async () => {
    let csv = new csvMerge("/../files/file1.csv", "/../files/file2.csv", "age", "/result.csv")
    csv.run();
})();
