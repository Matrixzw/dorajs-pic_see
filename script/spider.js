const axios = require('axios');
const cheerio = require('cheerio')




async function get_first(url) {
    let items = []
    let raw_html = ''
    try {
        res = await axios(encodeURI(url));
        raw_html = res.data
    } catch {
        console.error('在获取数据的时候出现错误，可以重新试试')
    }

    $ = cheerio.load(raw_html);

    lists = $('div[class="items-row column is-half-desktop is-half-tablet is-half-mobile"]')

    lists.each((i, ele) => {

        tag = $(ele).find('div[class= "item-tags tags"]>a').text().replace(/\s+/g,'');

        
        items.push({
            tag,
            title: $(ele).find('h2>a').text().trim(),
            second_url: $(ele).find('h2>a').attr('href'),
            img_url: $(ele).find('a>img').attr('data-src'),
        })
    })
    //console.log(items)
    return items

}




//get_first('https://buondua.com/tag/xing-meng-10829')

module.exports = {
    get_first,
    get_$
}


async function get_$(url) {

    let raw_html = '';

    try {
        await time_delay(1500)
        res = await axios(encodeURI(url));
        raw_html = res.data;
    } catch {
        console.error('在get_second里面出现出错')
    }
    $ = cheerio.load(raw_html)

    return $

}

//get_second(encodeURI('https://buondua.com/xiuren-no-4324-xing-meng-星萌-50-photos-25742'))

function time_delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}