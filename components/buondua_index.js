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

        let data = await get_first(url);

        if (data) {
            data.map(item => {
                items.push({
                    title: item.title,
                    style: 'vod',
                    image: item.img_url,
                    spanCount: 4,
                    summary: item.tag,
                    route: $route('buondua_second_index', { second_url: encodeURI(base_url + item.second_url) })
                })
            })
            return {
                items,
                nextPage: page ? page + 20 : 20
            }
        }
    }
}