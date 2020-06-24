const spider =require('../assets/spider')

module.exports = {
    type: 'list',

    async fetch() {

        let  data_b= await spider.spider_mizitu_m_zhuanti();
        data_show =[];
        let actions = [];
        data_b.map(item => {
            actions.unshift({


                title: item.title,
                route: $route('mzitu', { tag_url: item.second_url })
            }
                //route:$route(mzitu_tag,{tag:item})
            )
        });
        data_show.unshift({
            title: '美女专题',
            style: 'chips',
            actions: actions
        })
        return data_show
    }
}