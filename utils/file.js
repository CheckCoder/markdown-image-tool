const md5File = require('md5-file');
const fs = require('fs');

const tmpFileName = 'tmpFile.png';

/**
 * 生成文件名
 * @param {object} config 配置
 * @param {string} localPath 文件本地路径
 */
async function createName(config, localPath) {
    let {
        type,
        prefix,
        suffix
    } = config.cloudFileName;
    let name = '';
    if (type === 'md5') {
        name = await md5File(localPath);
    }
    return `${prefix}${name}${suffix}`;
}

/**
 * 删除临时文件
 */
function deleteTmpFile() {
    return new Promise((resolve, reject) => {
        fs.unlink(tmpFileName, (err) => {
            if (err) {
                reject({
                    msg: '删除临时文件失败',
                    err
                })
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