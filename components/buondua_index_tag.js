const { get_$ } = require("../script/spider");

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

        $ = await get_$(url);

        lists = $('div[class="thumb-wrapper four-thumbs"]')

        page = page ? page : 0
        lists.each((i, ele) => {
            items.push({
                style: 'category',
                title: page * 20 + i + 1 + '：=>' + $(ele).find('a>span').text().trim()
            })
            for (i in [0, 1, 2, 3]) {
                items.push({
                    style: 'book',
                    image: $(ele).find('div>img').eq(i).attr('data-src'),
                    title: $(ele).find('a>span').text().trim(),
                    route: $route('buondua_index', { url: base_url + $(ele).find('a').attr('href') }),
                    spanCount: 3
                })
            };
        });
        return {
            items,
            nextPage: page + 20
        }
    }
}