const fs = require('fs');
const hjson = require('hjson');

const checkPersonalConfigPath = './config-check.jsonc';
const defaultConfigPath = './config.jsonc';

/**
 * 获取配置
 */
function get() {
    return new Promise((resolve, reject) => {
        let configPath = defaultConfigPath;
        fs.access(checkPersonalConfigPath, fs.constants.F_OK, (err) => {
            if (!err) {
                configPath = checkPersonalConfigPath;
            }
            fs.readFile(configPath, 'utf8', (err, data) => {
                if (err) {
                    reject({
                        msg: '读取配置文件失败',
                        err
                    });
                } else {
                    try {
                        let dataJson = hjson.parse(data);
                        resolve(dataJson);
                    } catch (err) {
                        reject({
                            msg: '解析配置文件失败',
                            err
                        })
                    }
                }
            });
        });
    });
};

module.exports = {
    get
}