
const spider = require('../assets/spider')

/*
来源：mzitu.js
输入：整个单个data数据块，里面包含单个的image_url title date second_url
输出： category， date_time,  page_all, image_url_b ; title,
*/

module.exports = {
    type: 'list',



    async fetch({ args }) {
        let data_show = [];
        let page =0;
        try {
            while (1) {
                second_url = page ? args.second_url + '/' + page : args.second_url;
                // console.log(args, page)


                let data_b = await spider.spider_mizitu_m_b(second_url);



                let headers = {
                    'referer': 'https://www.mzitu.com'
                };

                data_show.push({
                    style: 'book',
                    image: {
                        value: data_b[0].image_url_b,
                        headers: headers
                    },
                    title: data_b[0].page_all,
                    spanCount: 4
                })
                console.log(data_show);
                page = (page || 1) + 1
            }

            //this.fresh();

            // nextPage: (page || 1) + 1


        } catch {
            $ui.toast('已经到底了嘤') //使用 try catch捕获异常

            return {
                items: data_show
            }
        }
    }
}