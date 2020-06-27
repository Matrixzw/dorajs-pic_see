
const avmoo = require('../script/avmoo')


const headers = {
    useragent: 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
};

module.exports = {
    type: 'list',
    //不能再弄searchRoute 会出错

    async fetch({ args, page }) {

        let items = [];

        let url = page ? page : args.url;

        if(this.keyword_url!=undefined){
            url =  page ? page : this.keyword_url
        };


        //console.log(url);

        if (page == undefined) {
            items.push(
                {
                    title: '点击搜索',
                    image: $icon('search', '#94bbbb'),

                    spanCount: 12,
                    onClick: async () => {
                        let keyword = await $input.prompt({
                            title: '输入搜索内容',
                            value: ''
                        });                       
                        if (keyword) {
                            this.keyword_url = 'https://avmoo.host/cn/search/' + encodeURI(keyword.trim());
                            this.page = 0;
                            this.title = keyword;
                            this.refresh();
                        }
                    }
                })
        }



        try {
            let data = await avmoo.get_item(url);

            page = data.pop();

            data.map(item => {
                items.push({
                    style: 'vod',
                    title: item.id,
                    image: {
                        value: item.image_url,
                        headers: headers
                    },
                    summary: item.title,
                    label: item.time,
                    spanCount: 3,
                    route: $route('avmoo_second', { item: item })
                })
            });



            return {
                items: items,
                nextPage: 'https://avmoo.host' + page
            }
        } catch (err) {
            console.log(err);
            $ui.alert('竟然已经到了底部了')
        }
    }
}