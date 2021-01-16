const md5File = require('md5-file');
const fs = require('fs');

const tmpFileName = 'tmpFile.png';

/**
 * 生成文件名
 * @param {object} config 配置
 * @param {string} localPath 文件本地路径
 */
function createName(config, localPath) {
    if (config.cloudFileNameType === 'md5') {
        return md5File(localPath);
    }
}

/**
 * 删除临时文件
 */
function deleteTmpFile() {
    return new Promise((resolve, reject) => {
        fs.unlink(tmpFileName, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve();
            }
        })
    });
}

module.exports = {
    tmpFileName,
    createName,
    deleteTmpFile
}