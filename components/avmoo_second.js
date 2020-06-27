
const avmoo = require('../script/avmoo')

module.exports = {
    type: 'list',
    allowBookmark: true,

    async fetch({ args }) {

        let items = [];

        try {
            console.log(args.item.second_url)
            let data = await avmoo.get_item_b(args.item);
            console.log(data)

            items.push({
                title: data.title
            }, {
                style: 'vod',
                image: data.image_url,
                route: $route('@image', { url: data.image_url_big }),
                title: '识别码：' + data.idcode,
                summary: '发行时间：' + data.release_time + '\t'+data.Length+'\n' + data.Length,
                spanCount: 12
            })

            let actions = [];
            if (data.tag_genre) {
                data.tag_genre.map(item => {
                    actions.push({
                        title: item.tag,
                        route: $route('avmoo', { url: item.tag_url })
                    })
                });
            };

            items.push({
                title: '类别',
                style: 'chips',
                actions: actions
            });

            if (data.studio) {
                items.push({
                    style: 'label',
                    title: '制作商：' + data.studio,
                    route: $route('avmoo_index', { url: data.studio_url }),
                    spanCount:3
                })
            };

            if (data.release) {
                items.push({
                    style: 'label',
                    title: '发行商：' + data.release,
                    route: $route('avmoo_index', { url: data.release_url }),
                    spanCount:3
                })
            };

            if (data.series) {
                items.push({
                    style: 'label',
                    title: '系列:' + data.series,
                    route: $route('avmoo_index', { url: data.series_url }),
                    spanCount:3
                })
            };

            if (data.author) {
                items.push({
                    style: 'label',
                    title: '导演：' + data.author,
                    route: $route('avmoo_index', { url: data.author_url }),
                    spanCount:3
                })
            };

            items.push({
                style:'label',
                title: '样品图片',
                spanCount:12,
            })

            

            

            data.images.map(item => {
                items.push({
                    style: 'book',
                    image: item.image_thumb,
                    route: $route('@image', { url: item.image }),
                    spanCount: 2
                })
            });

            if(data.actor){
                items.push({
                    style: 'book',
                    title: data.actor.name,
                    image: data.actor.image_url,
                    route:$route('avmoo_index',{url:data.url}),
                    spanCount:3
                })
            }


            return {
                items: items
            }
        } catch (err) {
            console.log(err)
        }

    }

}