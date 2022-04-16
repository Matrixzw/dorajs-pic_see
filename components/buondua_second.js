const { get_second, get_$ } = require("../script/spider")



module.exports = {
    type: 'list',
    async fetch({ args, page }) {
        let items = []
        let second_url = '';

        if (page) {
            second_url = args.second_url + '?page=' + page
        } else {
            second_url = args.second_url
        }


        let $ = await get_$(second_url)
        this.subtitle = $('div.article-info').text()
        if (!page) {

            this.all_page = $('div.pagination-list').eq(0).find('span').length

            let actions = [];
            tag_lists = $('div.article-tags').eq(0).find('div.tags>a')
            tag_lists.each((i2, ele2) => {
                actions.push({
                    title: $(ele2).find('span').text(),
                    route: $route('buondua_index', { url: encodeURI(base_url + $(ele2).attr('href')) })
                })
            })

            items.push({
                style: 'chips',
                title: this.title +'\t' +  $('div.article-info').text(),
                actions
            })
        }



        lists = $('div.article-fulltext>p')

        page = page ? page : 1;

        lists.each((i, ele) => {
            items.push({
                style: 'book',
                title: ((page - 1) * 20) + i + 1,
                spanCount: 6,
                image: $(ele).find('img').attr('data-src'),
                route: $route('@image', { url: $(ele).find('img').attr('data-src') })
            })
        });

        nextPage = page + 1;

        if (nextPage <= this.all_page) {
            return {
                items,
                nextPage
            }
        } else {
            $ui.toast(`${this.all_page}页图片加载完毕`)
            return items
        }

    }
}