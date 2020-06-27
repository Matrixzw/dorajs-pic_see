
const axios = require('axios')
const cheerio = require('cheerio')
const iconv = require('iconv-lite')
const jschardet = require('jschardet')
/*
输入： avmoo的一些url，应该是具有类似规则的
输出：second_url, image_url, tile, id, time.
描述：这个就是这么简洁，但是好像在H-viewer上他经常访问多了就访问不了了
*/

const headers = {
    useragent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
};


async function get_item(indexUrl) {
    let data = [];
    return new Promise((resolve, reject) => {

        axios({ url: indexUrl, responseType: 'stream' }, { headers: headers }).then(res => {
            //此时的res.data 则为stream 读大型文本的时候用到。
            let chunks = [];

            res.data.on('data', chunk => {
                chunks.push(chunk);
            });

            res.data.on('end', () => {
                let buffer = Buffer.concat(chunks); //把Buffer中的和之后的拼接起来，用了concat函数

                let charset = jschardet.detect(buffer).encoding //这个东西就是用来判断网页的代码的      
                let html = iconv.decode(buffer, charset); //现在html也可以直接显示出来了，后面一步是格式化一下

                $ = cheerio.load(html, { decodeEntities: false })

                let list = $('div#waterfall>div.item>a');

                for (i = 0; i < list.length; i++) {
                    let second_url = list.eq(i).attr('href');
                    let image_url = list.eq(i).find('img').attr('src');
                    let title = list.eq(i).find('div.photo-info>span').html().replace(/[(<i)|(<br)].*/, '').trim();

                    let id = list.eq(i).find('div.photo-info>span>date').eq(0).text();
                    if (/fire/.test(list.eq(i).find('div.photo-info>span').toString())) {
                        id = '♋ ♐' + id;
                    }
                    let time = list.eq(i).find('div.photo-info>span>date').eq(1).text();

                    data.push({ second_url, image_url, title, id, time })
                };

                let next_page = $('a#prev').eq(-1).attr('href');
                console.log(next_page)
                data.push(next_page);
                resolve(data)
            })
        }).catch(err => {
            console.log('error message');
            reject(err);
        })
    })

}

// indexUrl = 'https://avmoo.host/cn//page/2'
// get_item(indexUrl).then(res => {
//     console.log(res.slice(-3))
// })

/*
输入：一整个item数据。这个其实是要结合
输出：title, image_url, idcode, release_time, length
studio, label, series, genre_tag  this with url
sample image
*/

async function get_item_b(item) {
    let data = [];
    return new Promise((resolve, reject) => {


        let title = item.id + item.title;
        let idcode = item.id;
        let release_time = item.time;

        data.title = title;
        data.idcode = idcode;
        data.release_time = release_time


        axios({ url: item.second_url, responseType: 'stream' }, { headers: headers }).then(res => {
            //此时的res.data 则为stream 读大型文本的时候用到。
            let chunks = [];

            res.data.on('data', chunk => {
                chunks.push(chunk); //把一串串Buf对象放到chunk数组中，传递出来的流应该具有gb2312编码（按照网页来看的）
            }); //分成多次读取，每次触发一个data时间，文本结束时触发end事件。

            res.data.on('end', () => {
                let buffer = Buffer.concat(chunks); //把Buffer中的和之后的拼接起来，用了concat函数

                let charset = jschardet.detect(buffer).encoding //这个东西就是用来判断网页的代码的      
                let html = iconv.decode(buffer, charset); //现在html也可以直接显示出来了，后面一步是格式化一下

                $ = cheerio.load(html, { decodeEntities: false })


                //要从这个地方找到所有数据
                let list = $('div[class="col-md-3 info"]>p').toString();

                if (/长度/.test(list)) {
                    data.Length = list.match(/长度.*?<\/span>(.*?)<\/p>/)[1];
                };
                if (/制作商/.test(list)) {
                    data.studio = list.match(/制作商.*?<a href="(http.*?)">(.*?)<\/a>/)[2];
                    data.studio_url = list.match(/制作商.*?<a href="(http.*?)">(.*?)<\/a>/)[1];
                };
                if (/发行商/.test(list)) {
                    data.release = list.match(/发行商.*?<a href="(http.*?)">(.*?)<\/a>/)[2];
                    data.release_url = list.match(/发行商.*?<a href="(http.*?)">(.*?)<\/a>/)[1];
                };
                if (/系列/.test(list)) {
                    data.series = list.match(/系列.*?<a href="(http.*?)">(.*?)<\/a>/)[2];
                    data.series_url = list.match(/系列.*?<a href="(http.*?)">(.*?)<\/a>/)[1];
                };
                if (/导演/.test(list)) {
                    data.author = list.match(/导演.*?<a href="(http.*?)">(.*?)<\/a>/)[2];
                    data.author_url = list.match(/导演.*?<a href="(http.*?)">(.*?)<\/a>/)[1];
                };


                let actor_list = $('a.avatar-box');
                let actor = [];
                if (actor_list.length) {
                    actor.image_url = $('a.avatar-box img').attr('src');
                    actor.name = $('a.avatar-box').text().trim();
                    actor.url = $('a.avatar-box').attr('href');
                    data.actor = actor;
                }



                let image_url = $('a.bigImage>img').attr('src');
                let image_url_big = $('a.bigImage').attr('href');


                data.image_url = image_url;
                data.image_url_big = image_url_big;

                let tag_genre = [];
                list = $('div[class="col-md-3 info"]>p').eq(-1).find('a');
                for (i = 0; i < list.length; i++) {
                    let tag = list.eq(i).text();
                    let tag_url = list.eq(i).attr('href');
                    tag_genre.push({ tag, tag_url });
                }
                data.tag_genre = tag_genre;


                list = $('div#sample-waterfall>a');

                let images = [];
                for (i = 0; i < list.length; i++) {
                    let image_thumb = list.eq(i).find('img').attr('src');
                    let image = list.eq(i).attr('href')
                    images.push({ image, image_thumb })
                }
                data.images = images

                resolve(data)  //数据返回去之后在添加回去之后在说
            })
        }).catch(err => {
            console.log('error message');
            reject(err);
        })
    })

}

item = {
    second_url: 'https://avmoo.host/cn/movie/10cb2f0a7c9b25fd',
    image_url: 'https://jp.netcdn.space/digital/video/406mmraa00153/406mmraa00153ps.jpg',
    title: '江花紬 清純クロニクル',
    id: 'MMRAA-153',
    time: '2020-06-26'
}

get_item_b(item).then(res => {
    console.log(res)
})

module.exports = {
    get_item,
    get_item_b
}