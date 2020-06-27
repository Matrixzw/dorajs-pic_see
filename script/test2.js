let axios = require('axios')
let iconv = require('iconv-lite');
let cheerio = require('cheerio')
const jschardet = require('jschardet');




// axios({ url: 'https://m.mmonly.cc/mmtp/', responseType: 'stream' }).then(res => {
//     //此时的res.data 则为stream 读大型文本的时候用到。
//     // https://www.6dabc.cn/ 这个网站采用标准的utf-8
//     // 百度好像用的是ascii码
//     // https://m.mmonly.cc/mmtp/ 采用gb2312
//     let chunks = [];

//     res.data.on('data', chunk => {
//         chunks.push(chunk); //把一串串Buf对象放到chunk数组中，传递出来的流应该具有gb2312编码（按照网页来看的）
//     }); //分成多次读取，每次触发一个data时间，文本结束时触发end事件。

//     res.data.on('end', () => {
//         let buffer = Buffer.concat(chunks); //把Buffer中的和之后的拼接起来，用了concat函数
//         // 拼接所有的Buffer对象
//         //通过iconv来进行转化。
//         //console.log(buffer.toString());
//         console.log(jschardet.detect(buffer))
//         let html = iconv.decode(buffer, jschardet.detect(buffer).encoding);
//         console.log(html)
//         $ = cheerio.load(html, { decodeEntities: false })
//     })
// })

// const get_indexRule = require('./indexRule')
// get_indexRule('./script/taotu55.json').then(res => {
//     console.log(res.slice(0, 5))
//   //  console.log(indexUrl)
// })

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

ans = get_indexUrl('https://www.taotu55.net/w/61/37919'+'{pageStr:_{page:1}}.html',2)

console.log(ans.pop()+1)