const exec = require('child_process').exec;
const fileType = require('file-type');

const tmpFileName = require('./file').tmpFileName;
const imageType = 'image';
const fileDropListType = 'fileDropList'

/**
 * 获取剪切板中图片路径
 *    - 剪切板中为图片，则导出图片到本地，并返回路径
 *    - 剪切板中为文件队列且第一个为图片文件，则返回该图片路径
 */
function getImageLocalPath() {
    return new Promise((resolve, reject) => {
        let command = 
        `Add-Type -Assembly PresentationCore; \
        if ([Windows.Clipboard]::ContainsImage()) { \
            echo "${imageType}"; \
            $tmpFileName = """${tmpFileName}"""; \
            $clipBoardImage =  [Windows.Clipboard]::GetImage();\
            $clipBoardBitmap = new-object Windows.Media.Imaging.FormatConvertedBitmap( $clipBoardImage, [Windows.Media.PixelFormats]::Rgb24, $null, 0); \
            $ioStream = [IO.File]::Open(($tmpFileName), """OpenOrCreate"""); \
            $pngBitmapEncoder = New-Object Windows.Media.Imaging.PngBitmapEncoder; \
            $pngBitmapEncoder.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($clipBoardBitmap)); \
            $pngBitmapEncoder.Save($ioStream); \
            $ioStream.Dispose(); \
            echo $tmpFileName; \
        } elseif ([Windows.Clipboard]::ContainsFileDropList()){ \
            echo "${fileDropListType}"; \
            echo ([Windows.Clipboard]::GetFileDropList()); \
        };`;
        exec(`powershell.exe ${command}`, (err, stdout, stderr) => {
            if (err) {
                reject({
                    msg: '执行 powershell.exe 失败',
                    err
                });
            } else if (stderr){
                reject({
                    msg: '执行 powershell.exe 失败',
                    err: stderr
                });
            } else {
                let outLines = stdout.split('\r\n');
                if (outLines.length >= 2) {
                    let type = outLines[0];
                    let path = outLines[1];
                    if (type === imageType) {
                        resolve(path);
                    } else if (type === fileDropListType) {
                        // 剪切板中 fileDropList 第一个为图片文件才返回
                        fileType.fromFile(path).then((type) => {
                            if (type && type.mime && type.mime.includes('image/')) {
                                resolve(path);
                            } else {
                                resolve();
                            }
                        }).catch((err) => {
                            reject({
                                msg: '判断文件类型失败',
                                err
                            });
                        });
                    }
                } else {
                    resolve();
                }
            }
        });
    });
}

/**
 * 复制内容到剪切板
 * @param {string} text 文本内容
 */
function copy(text) {
    return new Promise((resolve, reject) => {
        let command = `Set-Clipboard '${text}'`;
        exec(`powershell.exe ${command}`, (err, stdout, sterr) => {
            if (err) {
                reject({
                    msg: '使用 powershell.exe 复制文本失败',
                    err
                });
            } else if (sterr) {
                reject({
                    msg: '使用 powershell.exe 复制文本失败',
                    err: sterr
                });
            } else {
                resolve();
            }
        });
    })
}

module.exports = {
    getImageLocalPath,
    copy
}