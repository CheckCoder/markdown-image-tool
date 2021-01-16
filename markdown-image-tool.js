const config = require('./utils/config');
const clipboard = require('./utils/clipboard');
const file = require('./utils/file');
const cloud = require('./utils/cloud');

async function main() {
    try {
        let localPath = await clipboard.getImageLocalPath();
        if (localPath) {
            let configJson = await config.get();
            let cloudFileName = await file.createName(configJson, localPath);
            let link = await cloud.uploadFile(configJson, localPath, cloudFileName);
            if (localPath === file.tmpFileName) {
                file.deleteTmpFile();
            }
            await clipboard.copy(`![](${link})`);
        }
    } catch (err) {
        console.log(err);
    }
}

main();
