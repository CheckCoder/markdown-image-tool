const qiniu = require('qiniu');

/**
 * 上传文件
 * @param {Object} config 配置
 * @param {string} localPath 本地文件路径
 * @param {string} cloudFileName 云端文件命名
 */
function uploadFile(config, localPath, cloudFileName) {
    return new Promise((resolve, reject) => {
        if (config.cloud === 'qiniu') {
            let { accessKey, secretKey, bucket, urlPrefix, urlSuffix, zone } = config.qiniu;

            let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
            let options = {
                scope: bucket,
            };
            let putPolicy = new qiniu.rs.PutPolicy(options);
            let uploadToken = putPolicy.uploadToken(mac);
        
            let qiniuConfig = new qiniu.conf.Config();
            if (zone) {
                qiniuConfig.zone = qiniu.zone[zone];
            }
            let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
            let putExtra = new qiniu.form_up.PutExtra();
        
            formUploader.putFile(uploadToken, cloudFileName, localPath, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject({
                        msg: 'qiniu 上传文件失败',
                        err: respErr
                    });
                } else if (respInfo.statusCode == 200) {
                    resolve(`${urlPrefix}${cloudFileName}${urlSuffix}`);
                } else {
                    reject({
                        msg: 'qiniu 上传文件失败',
                        err: respBody
                    });
                }
            });
        }
    });
}

module.exports = {
    uploadFile
}