/*
输入：url
输出：image_url, title, date, second_url; 返回到mizitu中调用 返回data
描述：相当于输出mzitu的第一页的结果
*/

const $http = require('axios'); //加上这个就会报错
const cheerio = require('cheerio');

url = 'https://www.mzitu.com/';

function spider_mizitu(url) {
    // var data = new Promise(resolve, reject) => {
    let data = [];
    headers = {
        'referer': 'https://www.mzitu.com/'
    }
    return $http.get(url, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);
        let list = $('ul#pins>li');
        for (i = 0; i < list.length; i++) {
            image_url = list.eq(i).find('img').attr('data-original');
            title = list.eq(i).find('img').attr('alt');
            date = list.eq(i).find('span.time').text();
            second_url = list.eq(i).find('a').attr('href');

            data.push({ image_url, title, date, second_url });
        };
        // console.log(data);
        return data

    }, err => {
        console.log(err)
    });


}



//这样就是返回一个Promise对象，但是没有reject和resolve。其实异步处理就是让操作互相不相关，然后就可以多步并行了。
//而Promise相当于又强行回到了按次序处理上面来，Promise.then
// spider_mizitu(url).then(data => {
//     console.log(data)
// }, res => {
//     console.log(res.code)
// })

/*
输入：url_m 表示手机端的url例如 https://m.mzitu.com
输出：还是数组列表 [{},{}...] {image_url, title, date, second_url}
描述：还是相当于第一页的数据，就是需要headers，这样可以保证不会出现那些时不时的盗链的图片
*/

function spider_mizitu_m(url_m) {
    // var data = new Promise(resolve, reject) => {
    let data = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(url_m, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);
        let list = $('article.placeholder>div');
        console.log(list.length)
        for (i = 0; i < list.length; i++) {
            image_url = list.eq(i).find('img').attr('data-original');
            title = list.eq(i).find('img').attr('alt');
            date = list.eq(i).find('span.time').text();
            second_url = list.eq(i).find('a').attr('href');

            data.push({ image_url, title, date, second_url });
        };
        // console.log(data);
        return data

    }, () => {
        console.log('err')
    });
}


/*
输出：二级页面的url，second_url
输出：category， date_time,  page_all, image_url_b ; title,其中category应该又有两个属性，tag和tag_url，设置为仍然是一个list好了
描述：
*/

function spider_mizitu_m_b(second_url) {
    let data_b = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(second_url, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);

        image_url_b = $('div.place-padding img').attr('src');
        date_time = $('div.post-meta>span.time').text();
        page_all = $('span.prev-next-page').text().replace('页', '');

        let category = [];
        list = $('div#post-tag li>a');
        for (i = 0; i < list.length; i++) {
            let tag_url = list.eq(i).attr('href');
            let tag_name = list.eq(i).text();
            category.push({ tag_name, tag_url });
        }

        data_b.push({ image_url_b, date_time, page_all, category })
        // console.log(data);
        return data_b
    }).catch(err => {
        return err //返回异常信息（其实不用携带具体信息）
    })
}

/* 
输入：zipai的url：https://m.mzitu.com/zipai/
输出：time， image_url, title，next_url 后面两个仅出现在最后一项[-1]提取
描述：
*/

function spider_mizitu_m_zipai(url) {
    let data_b = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(url, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);

        let list = $('li[class^=comment]');
        let title = $('h3.block-line>span').text();
        let next_url = $('div[class="prev-next share-fenye"]>a').eq(-1).attr('href'); //后面不要又点击回去了，必须要eq(-1)
        for (i = 0; i < list.length; i++) {
            let image_url = list.eq(i).find('img').attr('data-original');
            let date_time = list.eq(i).find('a').text().trim();
            data_b.push({ image_url, date_time })
        }

        //console.log(data_b);
        data_b.push({ title, next_url })
        return data_b
    }).catch(err => {
        return err //返回异常信息（其实不用携带具体信息）
    })
}

function spider_mizitu_m_all() {
    let url = 'https://m.mzitu.com/all/';
    let data = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(url, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);

        let list = $('div#post-archives>div');
        console.log(list.length)
        for (i = 0; i < 300; i++) { //300条数据差不多了
            let second_url = list.eq(i).find('a.clear').attr('href') || '';
            let title = list.eq(i).find('a.clear').text().trim() || list.eq(i).find('h3').text();
            data.push({ second_url, title })
        }

        //console.log(data_b);
        return data
    }).catch(err => {
        return err //返回异常信息（其实不用携带具体信息）
    })
}

function spider_mizitu_m_zhuanti() {

    url_m = 'https://m.mzitu.com/zhuanti/'
    let data = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(url_m, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);

        let list = $('div[class="place-padding tags"]>a');
        console.log(list.length)
        for (i = 0; i < 300; i++) { //300条数据差不多了
            let second_url = list.eq(i).attr('href') || '';
            let title = list.eq(i).text();
            data.push({ second_url, title })
        }

        //console.log(data_b);
        return data
    }).catch(err => {
        return err //返回异常信息（其实不用携带具体信息）
    })
}

/*
输入：第二层页面的url second_url
输出：热门推荐的目录，包括image_url, title,second_url_2。包括网友爱看的内容两个东西包装成一个数组
描述：是一个数组。
*/

function spider_mizitu_m_b_2(second_url) {
    let data_b = [];
    headers = {
        'user-agent': 'Mozilla/5.0 (Linux; Android 4.2.1; M040 Build/JOP40D) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
        //'user-agent':'UCWEB7.0.2.37/28/999'
    }
    return $http.get(second_url, { headers: headers }).then(res => {
        const $ = cheerio.load(res.data);

        list = $('div.hot>ul a');
        console.log('位置spider>spider_mizitu_m_b_2', list.length)
        for (i = 0; i < list.length; i++) {
            let title = list.eq(i).find('span').text();
            let image_url = list.eq(i).find('img').attr('data-original');
            let second_url_2 = list.eq(i).attr('href')
            data_b.push({ title, image_url, second_url_2 });
        }

        let data_b_2 = []
        let list_2 = $('ul.same-cat-post>li>a');
        console.log('位置：spider', list_2.length)
        for (i = 0; i < list_2.length; i++) {
            let title = list_2.eq(i).text();
            let second_url_2 = list_2.eq(i).attr('href')
            data_b_2.push({ title, second_url_2 })
        };

        // console.log(data);
        return data_b = [data_b, data_b_2]
    }).catch(err => {
        return err //返回异常信息（其实不用携带具体信息）
    })
}


/*
输入：最后的items数组，里面包含url，title。
输出：不输出，就是保存到一个文件夹中
*/

function spider_mizitu_m_download(items){

}


module.exports = {
    spider_mizitu, //第一个函数，但是没有调用过，处理的是电脑端网页的模式
    spider_mizitu_m, //网页的第一层页面
    spider_mizitu_m_b, //_b表示第二层页面
    spider_mizitu_m_zipai, //特别提取zipai页面的，这个页面的特点是给了url就直接返回大图，没有第二层页面
    spider_mizitu_m_all, //最近更新的页面，就是list跳转到_b
    spider_mizitu_m_zhuanti, //其实就是tag页面，里面用了chips style
    spider_mizitu_m_b_2 // 对于_b函数的补充，补充的内容是拉取到底部之后显示推荐的两个栏目
}

// args ={keyword:'杨晨'};
// url_m = true ? 'https://m.mzitu.com/'+  encodeURI(args.keyword) + '/page/' + 1 + '/' : 'https://m.mzitu.com/' + encodeURI(args.keyword);
// console.log(url_m);
//'https://m.mzitu.com/search/%E6%9D%A8%E6%99%A8/'
second_url = 'https://m.mzitu.com/170059'
url = 'https://m.mzitu.com/zipai/comment-page-453/#comments'
items = [];
url_m = 'https://m.mzitu.com/zhuanti/'
console.log(spider_mizitu_m_b(second_url).then(res => {
    console.log(res[0].image_url_b)

}))



// for(page=0; page<4; page++){
//     args = { second_url: 'https://m.mzitu.com/235299' };

//     second_url = page ? args.second_url + '/' + page : args.second_url;
//     console.log(second_url)
//     spider_mizitu_m_b(second_url).then(res => {
//         console.log(res);
//         //
//     })

// }