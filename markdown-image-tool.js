const config = require('./utils/config');
const clipboard = require('./utils/clipboard');
const file = require('./utils/file');
const cloud = require('./utils/cloud');
const countDown = require('./utils/countDown');

process.on('unhandledRejection', (err) => {
    console.log('unhandledRejection');
    console.log(err);
});

async function main() {
    try {
        countDown.start();
        let localPath = await clipboard.getImageLocalPath();
        if (localPath) {
            let configJson = await config.get();
            let cloudFileName = await file.createName(configJson, localPath);
            let link = await cloud.uploadFile(configJson, localPath, cloudFileName);
            if (localPath === file.tmpFileName) {
                file.deleteTmpFile();
            }
            await clipboard.copy(`![](${link})`);
            console.log('Markdown链接生成并复制成功');
            console.log(`耗时 ${countDown.dot(false)}毫秒`);
        } else {
            console.log('剪切板中没有图片');
        }
    } catch (err) {
        console.log(err);
        clipboard.copy(JSON.stringify({
            msg: err.msg,
            err: err.err.toString()
        }));
    }
}

main();
