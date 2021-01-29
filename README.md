# markdown-image-tool

## 软件简介

Markdown贴图工具，支持通过快捷键将剪切板中的图片上传到图床，并粘贴带图片链接的Markdown文本。

## 使用说明

### 1、依赖

程序只支持 **Windows x64** 平台，并且需要安装 **Powershell**（一般 Windows 10 都会自带）。

### 2、下载

- [下载release版本](https://github.com/CheckCoder/markdown-image-tool/releases/download/v1.1.0/markdown-image-tool.zip)并解压，如下图所示：

    ![](http://check-note-image.scauhelper.club/7482ffe92eea572aec9b9762ebdfa980)

- 其中：
    - AutoHotKey.exe 为主程序，打开即可使用
    - config.jsonc 为配置文件
    - markdown-image-tool.exe 为图片上传工具

### 3、配置

#### 概述

``` jsonc
{
    "cloud": "qiniu", // 云存储类型，目前仅支持 qiniu
    "cloudFileName": { // 存放在云端文件名
        "type": "md5", // 命名规则，目前仅支持 md5
        "prefix": "", // 文件名前缀
        "suffix": "" // 文件名后缀
    },
    "qiniu": { // qiniu 存储配置
        "accessKey": "", // 密钥 AccessKey
        "secretKey": "", // 密钥 SecretKey
        "bucket": "", // 存储空间名
        "urlPrefix": "http://yourdomain.com/", // 输出链接的前缀
        "urlSuffix": "" // 输出链接的后缀
    }
}
```
工具的工作流程是这样的：
1. 获取剪切板中的图片
2. 根据配置生成文件名 `cloudFileName`
3. 上传文件，云存储中的文件名就是生成的 `cloudFileName`
4. 粘贴 `![](urlPrefix+cloudFileName+urlSuffix)`

#### qiniu 配置

- accessKey、secreKey：用于生成七牛云的上传凭证。可以访问 https://portal.qiniu.com/user/key 登录后查看。

    ![](http://check-note-image.scauhelper.club/76ec935ca0155ef1c57a02524095d2b4)

- bucket：存储空间的名称：可以访问 https://portal.qiniu.com/kodo/bucket 查看（如果没有空间需要新建空间）。

    ![](http://check-note-image.scauhelper.club/ffc29f4868101666c6904012601ecb9e)

- urlPrefix：输出链接的前缀，如：生成文件名为 `fileName` ，urlPrefix为 `http://domain.com/`，则最后粘贴为：`![](http://domain.com/fileName)`。故一般填写空间域名。

    ![](http://check-note-image.scauhelper.club/7bf48d0f7ac13635ae2511684092a2de)

- urlSuffix：输出链接的后缀，如：生成文件名为 `fileName` ，urlPrefix为 `http://domain.com/`，urlSuffix为 `?imageView2/1/w/200/h/200`，则最后粘贴为：`![](http://domain.com/fileName?imageView2/1/w/200/h/200)`。因此可以用于对添加对图片处理的参数。
具体可以查看 [七牛图片处理接口文档](https://developer.qiniu.com/dora/3683/img-directions-for-use)、[样式分割符](https://developer.qiniu.com/kodo/kb/1327/what-is-the-style-and-the-style-separators)

#### 使用

- 复制截图/本地文件
- Ctrl + B

![](http://check-note-image.scauhelper.club/806bf16dfb97d25dd8504820ff7d5910)

### 5、常见问题可能原因及解决方法

当出现问题时会粘贴出错误问题，可以据此判断是什么问题，格式如下：
```json
{
    "msg": "错误信息概要",
    "err": "详细错误信息"
}
```

#### 读取配置文件失败

- 配置文件 `config.jsonc` 不存在或格式错误，配置文件必须和 `markdown-image-tool.exe` 处于同一目录下。
- `markdown-image-tool.exe` 无权限访问 `config.jsonc`，可以使用管理员身份打开 `markdown-image-tool.exe`，或者将 `config.jsonc` 设置为所有用户可读。

#### qiniu 上传文件失败

- `config.jsonc` 配置有问题，需要检查 `accessKey`、`secretKey` 和 `bucket` 有没有配置正确。
- 网络问题

其它问题可以[提issue](https://github.com/CheckCoder/markdown-image-tool/issues/new)

## 开发说明

### 实现

`markdown-image-tool.exe` 使用 node js 编写，并使用 pkg 打包成 exe 文件。通过执行 powershell 获取剪切板内容，如果为图片，则使用 [qiniu SDK](https://developer.qiniu.com/kodo/1289/nodejs) 上传图片。

`AutoHotKey.exe` 为 AutoHotKey.ahk 编译而来，当按下 ctrl+b 时会调用 `markdown-image-tool.exe`。

### 部署

- 下载源代码 `git clone https://github.com/CheckCoder/markdown-image-tool.git`
- 切换目录 `cd markdown-image-tool`
- 安装依赖 `npm install`
- 运行 `node markdown-image-tool.js`
- 打包 `pkg markdown-image-tool.js -t node14-win-x64`
- 若想要修改快捷键可以修改 `AutoHotKey.ahk` 文件并重新编译

## 特别感谢

- [AutoHotKey](https://www.autohotkey.com/) AutoHotkey 是 Windows 上免费开源的脚本语言，可以轻松地为各种任务创建小型到复杂的脚本。
- [qimage-win](https://github.com/jiwenxing/qimage-win) 实现过程中这个项目给了我很大的启发。
- [img-clipboard-dump](https://github.com/octan3/img-clipboard-dump) 使用 powershell 从剪切板中获取图片。

## LICENSE

[MIT License](https://github.com/CheckCoder/markdown-image-tool/blob/master/LICENSE)

Copyright (c) 2021 CheckCoder
