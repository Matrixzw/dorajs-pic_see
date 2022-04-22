const { get_first } = require("../script/spider")



module.exports = {
    type: 'list',
    async fetch({ args, page }) {
        let items = []

        let url = '';
        if (page) {
            url = args.url + '?start=' + page
        } else {
            url = args.url
        }

        try {
            data = await get_first(url);
        } catch(err){
            console.error(err);
            items.push({
                style: 'label',
                title: '在进行多次尝试之后仍然没有获取数据，请检查网络',
                spanCount: 12
            })
            return items
        }

        if (data) {
            data.map(item => {
                items.push({
                    title: item.title,
                    style: 'vod',
                    image: item.img_url,
                    spanCount: 4,
                    summary: item.tag,
                    route: $route('buondua_second', { second_url: encodeURI(base_url + item.second_url) })
                })
            })
            return {
                items,
                nextPage: page ? page + 20 : 20
            }
        }
    }
}
