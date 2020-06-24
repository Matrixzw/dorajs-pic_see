
const spider = require('../assets/spider')


module.exports = {
    type: 'list',
    //   tabMode: "fixed",
    //searchRoute: $route('list'),



    async fetch({ args, page }) {
        //url = 'https://www.mzitu.com/';
        url_m = '';
        console.log(Object.keys(args)[0])
        switch (Object.keys(args)[0]) {
            case 'href': url_m = page ? 'https://m.mzitu.com' + encodeURI(args.href) + 'page/' + page + '/' : 'https://m.mzitu.com' + args.href;
                break;
            case 'keyword': url_m = page ? 'https://m.mzitu.com/search/' + encodeURI(args.keyword) + '/page/' + page + '/' : 'https://m.mzitu.com/search/' + encodeURI(args.keyword);
                break;
            case 'tag_url': url_m = page ? args.tag_url + 'page' + page : args.tag_url;
        };


        //let data = await spider.spider)mizitu(url) //用www的总是给我返回那些盗链的图片，没法解决
        try {
            let data = await spider.spider_mizitu_m(url_m); //调用spider_mizitu_m函数，处理手机网页
            //console.log(url_m)
            items = [];

            data.map(item => {
                items.push({
                    style: 'vod',
                    title: item.title,
                    spanCount: 3,
                    image: {
                        value: item.image_url || '',
                        headers: {
                            // 'user-agent': 'okhttp/2.0',
                            'referer': 'https://www.mzitu.com'
                        }
                    },
                    summary: item.date,
                    route: $route('mzitu_b', item)
                })
            });
            //  console.log(page, args)


            // console.log(this.page);

            //console.log(page) (null || 1) + 1 = 2


            return {
                items: items,
                nextPage: (page || 1) + 1
            }
        } catch{

        }


    }
}
