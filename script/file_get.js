/*
输入：json格式文件位置file_position 'D:/Program Files/Git/filerec/gitee/Index/sites/xgmn.json' 
输出：js单个对象，整个文本数据。是一个Promise函数
描述：输入的时候文件位置要用斜杠/，也可以用相对路径'/script/test.json'，默认编码为utf-8，可以withbom.这个是读取文件的一个操作，但是好像存放文件总是会遇到问题。
*/
const fs = require('fs')
const bomstrip = require('bomstrip');


function file_get(file_position) {

    return new Promise((resolve, rejects) => {
        let result = fs.createReadStream(file_position).pipe(new bomstrip()); //正在写入的时候，调用bomstrip一下

        var chunks = [];
        result.on('data', chunk => {
            chunks.push(chunk)
        })

        result.on('end', () => {
            res = Buffer.concat(chunks).toString(); //在这个位置可以指定转码模式，现在是默认utf-8
            // console.log(JSON.parse(res))
            resolve(JSON.parse(res))
        })

        result.on('error', (err) => {
            console.log('err message');
            rejects(err)
        })
    })



};


module.exports = {
    file_get, //一个函数直接就调用了，不用对象什么的
    //downloadFile
}




/*
输入：一个image_url, 文件存放位置filepath, 可以是相对路径，文件名name，例如test_pic.jpg
输出：没有输出，但是把文件保存到了指定的文件夹里面。返回一个Promise对象，如果成功则输出一句话，失败则输出error信息
描述：基本上这个过程利用pipe函数就可，核心功能。默认w模式，没有则创建，存在则覆盖。这里仅仅是读取已经存在的文件都显示没有权限
*/


