//调用外部库脚本
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const jschardet = require('jschardet')

//调用自定义脚本
const file_get = require('./file_get')


/*
输入：file_position就是json格式的H-Viewer代码是经过处理的Promise 对象，page参数传进来，可能undefined，利用这个参数得到categories的url
输出：一个数组items，里面包含{ [idCode, ?cover, ?datetime, ?title, ?uploader}, ...]，还是Promise对象
描述：
*/

async function get_indexRule(file_position, page, flag = 'indexRule', idCode) {
    let indexRule = [];

    let json_api = await file_get.file_get(file_position); //获取json对象的。


    let indexUrl = json_api.indexUrl; //这里得处理


    switch (flag) {
        case 'indexRule': {
            json_api = json_api.indexRule;
            if (json_api.categories) {
                //console.log(json_api.categories) 的确出现了很多url
                indexUrl = get_indexUrl(json_api.categories[0].url, page);
                page = indexUrl.pop(); //这一步非常舒服，但是之后还是一个数组
                indexUrl = indexUrl[0];
            };
        }; break;
        case 'galleryRule': {
            console.log(idCode)
            //console.log(json_api.galleryUrl)
            let galleryUrl = json_api.galleryUrl.replace(/{idCode:}/, idCode);
            //console.log(galleryUrl)
            indexUrl = get_indexUrl(galleryUrl, page);
            page = indexUrl.pop();
            indexUrl = indexUrl[0]

            //console.log(indexUrl)
            json_api = json_api.galleryRule.pictureRule;
        }; break;
    };
    indexRule = await get_html_item(indexUrl, json_api, flag);

    indexRule.push(page);

    return indexRule

};

module.exports = get_indexRule;

// 测试函数，调用
// file = 'D://Program Files/Git/filerec/gitee/Index/sites/taotu55.json';
// D:\Program Files\Git\filerec\gitee\Index\sites\xgmn.json

let keyword = 'taotu55';
// var file = 'D:/Program Files/Git/filerec/gitee/Index/sites/' + keyword + '.json';
// get_indexRule(file, undefined, 'galleryRule', 'https://www.taotu55.net/w/61/37919').then(res => {
//     console.log(res.slice(-3)) //输出后面三个即可
// })

/*
输入：第二层的json对象，也就是例如indexRul_title这种，还有一个素质其实就是对应的html代码块。
输出：处理之后的title
描述：使用正则表达式提取相关数据，
*/

var keyword_switch = (json_api_2, value) => {
    switch (json_api_2.fun) {
        case 'html': value = value.html(); break;
        case 'attr': value = value.attr(json_api_2.param); break
        case 'text': value = value.text(); break;
    };
    if (json_api_2.regex) {
        //    console.log(value)
        return value.match(RegExp(json_api_2.regex, 'm'))[1] //没有处理具有replacemaent情形的处理                   
    };
    return value
}

/*
输入：整个list，就是html页面的选的标签，对应的json_api_2,和第i个list主要是函数里面有引用到了
输出：return处理之后的数据，调用了keyword_switch函数。
描述：这个使得原来的函数变得十分简洁，返回数据中有些undefined变量。这里如果出现selector和选择的item中的selector最后一个元素是一样的话，那么我们就去掉这个元素
*/

var html_item = (list, json_api_2, i, last_word) => {
    if (json_api_2) { //json有这个属性 例如idCode
        let selector = json_api_2.selector.replace(RegExp(last_word + '[>+ ]?'), '');
        let value = list.eq(i);
        if (selector) { //为了兼容，去掉收尾字符
            value = value.find(json_api_2.selector);
        };
        value = keyword_switch(json_api_2, value)

        return value
    }
}

/*
输入：categories中的url对象，就是包含pageStr或者page的东西的
输出：把pageStr按照H-Viewer的规则处理。注意这里还返会了最后一个数值1
描述：这个就是处理indexUrl的函数，那些page：pageStr之类的
*/

function get_indexUrl(url, page) {
    let first_page = page;

    if (page) {
        console.log(first_page);
        url = url.replace(/{pageStr:|}/g, '');
        return [url.replace(/{page:\d+}?/, page), page]

    } else if (/{page:/.test(url)) //如果page没有值，但是还是有page参数，就把page后面的那个参数提取出来
    {
        first_page = Number(url.match(/{page:(\d+)/)[1]);
        if (/{pageStr:/.test(url)) {
            return [url.replace(/{pageStr:.*}/, ''), first_page]
        } else {
            url = url.replace(/{pageStr:|}/g, '')
            url = url.replace(/{page:\d+}?/, first_page)
            return [url, first_page]
        }
    }

}


/*
输入： indexUrl，就是初始的那些url，要经过处理变成可以直接访问的数据，json_api就是json处理过的那些indexRule，flag目前有indexRule和galleryRule
输出：基本这个输出就是结果了，就是一个大数组的样子。

*/


function get_html_item(indexUrl, json_api, flag) {
    let indexRule = [];
    return new Promise((resolve, reject) => {
        headers = {
           // referer:'https://www.taotu55.net/'
        };
        axios({ url: indexUrl, responseType: 'stream' },{headers:headers}).then(res => {
            //此时的res.data 则为stream 读大型文本的时候用到。
            let chunks = [];

            res.data.on('data', chunk => {
                chunks.push(chunk); //把一串串Buf对象放到chunk数组中，传递出来的流应该具有gb2312编码（按照网页来看的）
            }); //分成多次读取，每次触发一个data时间，文本结束时触发end事件。

            res.data.on('end', () => {
                let buffer = Buffer.concat(chunks); //把Buffer中的和之后的拼接起来，用了concat函数
                // 拼接所有的Buffer对象
                //通过iconv来进行转化。
                let charset = jschardet.detect(buffer).encoding //这个东西就是用来判断网页的代码的      
                let html = iconv.decode(buffer, charset); //现在html也可以直接显示出来了，后面一步是格式化一下

                $ = cheerio.load(html, { decodeEntities: false })

                let list = $(json_api.item.selector);
                let last_word = json_api.item.selector.match(/[>+ ]?(\w+)$/)[1]

                for (i = 0; i < list.length; i++) {
                    switch (flag) {
                        case 'indexRule': {
                            let idCode = html_item(list, json_api.idCode, i, last_word);
                            let cover = html_item(list, json_api.cover, i, last_word);
                            let datetime = html_item(list, json_api.datetime, i, last_word);
                            let title = html_item(list, json_api.title, i, last_word);
                            let upload = html_item(list, json_api.upload, i, last_word);
                            let category = html_item(list, json_api.category, i, last_word);
                            let description = html_item(list, json_api.description, i, last_word);


                            indexRule.push({ idCode, cover, datetime, title, upload, category, description });
                        }; break;
                        case 'galleryRule': {
                            let thumbnail = html_item(list, json_api.thumbnail, i, last_word); //问题出现在同一级的还在选择，不能find了
                            let url = html_item(list, json_api.url, i, last_word);


                            indexRule.push({ url, thumbnail });
                        }; break;
                    }


                };
                resolve(indexRule)  //数据返回去之后在添加回去之后在说
            })
        }).catch(err => {
            console.log('error message');
            reject(err);
        })
    })

}


