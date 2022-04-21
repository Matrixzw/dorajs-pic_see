
const { get_second, get_$ } = require("../script/spider")

const mysql = require('mysql')

module.exports = {
    type: 'list',

    
    async fetch({ args, page }) {
        let items = []
        let second_url = '';

        if (page) {
            second_url = args.second_url + '?page=' + page
        } else {
            second_url = args.second_url
        };

        let $ = await get_$(second_url)

        switch (args.flag) {
            case 1: {
                lists = $('a[class = "item-link popunder"]');
                lists.each((i, ele) => {
                    items.push({
                        style: 'vod',
                        title: $(ele).find('img').attr('alt'),
                        image: $(ele).find('img').attr('data-src'),
                        route: $route('buondua_second_index', { second_url: base_url + $(ele).attr('href') }),
                        spanCount: 4
                    })
                })
                return items
            };
            case 2: {
                lists = $('a[class="popunder"]');
                lists.each((i, ele) => {
                    items.push({
                        style: 'vod',
                        title: $(ele).find('img').attr('alt'),
                        image: $(ele).find('img').attr('data-src'),
                        route: $route('buondua_second_index', { second_url: base_url + $(ele).attr('href') }),
                        spanCount: 4
                    })
                })
                return items
            }

        }
    }
}
