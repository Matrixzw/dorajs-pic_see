
const spider = require('../assets/spider')

/*
来源：mzitu.js
输入：整个单个data数据块，里面包含单个的image_url title date second_url
输出： category， date_time,  page_all, image_url_b ; title,
描述：控制了第二层页面的内容，包括了最上面的tag用了chips style，中间的pic主要内容，还是用了book style。再下面的热门推荐和网页最爱。
*/

module.exports = {
    type: 'list',




    async fetch({ args, page }) {
        let data_show = [];
        let headers = {
            'referer': 'https://www.mzitu.com'
        };
        try {
            for (page_i = 1; page_i <= 12; page_i++) { //竟然忘记这里page_i++ 12个一组有点慢改为12个一组吧

                second_url = args.second_url + '/' + ((page || 0) * 12 + page_i); //就是因为后面没有加括号浪费了很多时间
                // console.log(args, page)

                let data_b = await spider.spider_mizitu_m_b(second_url);



                data_show.push({
                    style: 'book',
                    image: {
                        value: data_b[0].image_url_b,
                        headers: headers
                    },
                    title: data_b[0].page_all,
                    spanCount: 4,
                    route: $route('@image', { url: data_b[0].image_url_b }) //这个命令直接是点击查看大图，设置type为image
                });

                this.subtitle = '更新时间：' + data_b[0].date_time;
                //console.log(data_b[0].category);
                if (page_i == 1 && page == undefined) { //这样就能保证只出现一次了
                    // let str = data_b[0].category.split(/[:：、]/);
                    // str.shift();
                    let actions = [];
                    data_b[0].category.map(item => {
                        actions.unshift({
                            title: item.tag_name,
                            route: $route('mzitu', { tag_url: item.tag_url })
                        }
                            //route:$route(mzitu_tag,{tag:item})
                        )
                    });
                    data_show.unshift({
                        title: '精彩专题',
                        style: 'chips',
                        actions: actions
                    })
                    //console.log('adffadfd',str)
                    //通过修改spider传递出来了一个category obj，通过调用res[0].category就是一个tag的数组

                }

            };
            // console.log(data_show)
            return {
                items: data_show,
                nextPage: (page || 0) + 1
            };

        } catch {
            console.log(page)
            $ui.toast('已经到底了嘤'); //使用 try catch捕获异常
            data_show.push({
                style: 'dashboard',
                title: '热门推荐',
                color: 'white',
                textColor: 'black'
            });


            let data_b = await spider.spider_mizitu_m_b_2(args.second_url); //必须要用await 不然就返回Promise了
            //console.log('mzitu_b', data_b[1]); //consloe.log的时候必须加上位置，不然找到找不到了
            data_b[0].map(item => data_show.push({
                style: 'book',
                image: {
                    value: item.image_url,
                    headers: headers
                },
                title: item.title,
                spanCount: 3,
                route: $route('mzitu_b', { second_url: item.second_url_2 })
            }));
            data_show.push({
                style: 'label',
                title: '网友最爱',
                color: 'red',
                spanCount: 12
            })
            data_b[1].map(item => data_show.push({
                title: item.title,
                route: $route('mzitu_b', { second_url: item.second_url_2 })
            }));

            

            console.log('这里应该是data最后出现一次的data_show，应该是最后一点数据',data_show)

            return data_show
        }
    }
}