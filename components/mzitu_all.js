
const spider = require('../assets/spider')

/*
来源： mzitu_drawer.js
调用： 调用spider里面的all函数
描述：期望展示的是一些list数据，然后点击进入另外地方，但是好像3k多数据太多了，先展示看看吧

*/

module.exports = {
    type: 'list',
    title: '每日更新',

    async fetch() { //不需要参数
        let items = [];

        let data = await spider.spider_mizitu_m_all();

        for (i = 0; i < data.length; i++) {
            if (data[i].second_url) {
                items.push({
                    title: data[i].title,
                    route: $route('mzitu_b', { second_url: data[i].second_url })
                })
            } else {
                items.push({
                    title: data[i].title,
                    image: $icon('date_range')
                })
            }
        };
        console.log(items)
        return items

    }

}