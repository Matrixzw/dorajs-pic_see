const { get_second, get_$, sql_add_data, sql_get_flag, sql_get_data, rpc_trans, sql_download, sql_change_flag } = require("../script/spider")

const mysql = require('mysql')


module.exports = {
    type: 'list',
    beforeCreate() {
        
        connection = mysql.createConnection({
            host: '192.168.2.26',
            user: 'zzw',
            password: 'admin',
            port: '3306',
            database: 'xiuren',
            "useConnectionPooling": true //增加该配置
        })

        connection.connect()
    },

    destroyed() {
        connection.end()
    },

    async fetch({ args, page }) {
        let items = []
        let second_url = '';


        if (!page) {
            try{
                this.flag = await sql_get_flag( this.title + '-0');
                console.log('获取到了flag数据')
            }catch{
                console.error('其实没有获取flag参数')
                this.flag = 0
            }
        }

        if (this.flag == 0) {
            this.subtitle = '正在缓存'
            var description = ''
            if (page) {
                second_url = args.second_url + '?page=' + page
            } else {
                second_url = args.second_url
            }


            let $ = await get_$(second_url)
            //this.subtitle = $('div.article-info').text()
            if (!page) {
                //this.subtitle = '正在缓存'
                this.all_page = $('div.pagination-list').eq(0).find('span').length

                let actions = [];
                tag_lists = $('div.article-tags').eq(0).find('div.tags>a')
                tag_lists.each((i2, ele2) => {
                    actions.push({
                        title: $(ele2).find('span').text(),
                        route: $route('buondua_index', { url: encodeURI(base_url + $(ele2).attr('href')) })
                    })
                })

                actions.push({
                    title: '其他作品',
                    route: $route('buondua_second_2', { second_url: args.second_url, flag: 1 })
                }, {
                    title: 'You May Like',
                    route: $route('buondua_second_2', { second_url: args.second_url, flag: 2 })
                })

                description = this.title + '\t' + $('div.article-info').text();
                items.push({
                    style: 'chips',
                    title: description,
                    actions
                })
            }

            lists = $('div.article-fulltext>p')

            page = page ? page : 1;

            lists.each((i, ele) => {
                let image = $(ele).find('img').attr('data-src');
                let title = ((page - 1) * 20) + i; //从0开始
                items.push({
                    style: 'book',
                    title,
                    spanCount: 6,
                    image,
                    route: $route('@image', { url: $(ele).find('img').attr('data-src') })
                })
                //开始图片写入操作
                let sql_params = [title, this.title + '-' + title, image, description];
                sql_add_data( sql_params)
            });

            nextPage = page + 1;

            if (nextPage <= this.all_page) {
                return {
                    items,
                    nextPage
                }
            } else {
                $ui.toast(`${this.all_page}页图片加载完毕`)
                sql_change_flag( 1, this.title)
                //在底部添加一个传输下载的按钮
                items.push({
                    style: 'chips',
                    title: '点击发送到aria2下载',
                    actions: [{
                        title: '点击下载',
                        onClick: async () => {
                            let data = await sql_download(this.title);
                            rpc_trans(data);
                            sql_change_flag( data.length, this.title)
                        }
                    }]
                });

                return items
            }
        } else if (this.flag == 1) {
            this.subtitle = '已经缓存完毕'
            let data = await sql_get_data(this.title);
            data.map((val, i) => {
                items.push({
                    style: 'book',
                    image: val.img_url,
                    title: val.id,
                    spanCount: 6
                })
            });
            items.push({
                style: 'chips',
                title: '点击发送到aria2下载',
                actions: [{
                    title: '点击下载',
                    onClick: async () => {
                        let data = await sql_download(this.title);
                        rpc_trans(data);
                        sql_change_flag(data.length, this.title)
                    }
                }]
            });

            return items
        } else if (this.flag > 1) {
            this.subtitle = '已下载'

            // if (first_item.description) {
            //     items.push({
            //         style: 'article',
            //         title: this.title,
            //         summary: first_item.description,
            //         time: first_item.description.match(/\d{4}.\d{2}.\d{2}/)
            //     });
            // }


            for (i = 0; i < this.flag; i++) {
                items.push({
                    style: 'book',
                    image: 'http://192.168.2.26:8088/api/public/dl/d68Ic_ru/buondua/' + this.title + '/' + i + '.jpg',
                    title: i + '.jpg',
                    spanCount: 4,
                    route: $route('@image', { url: 'http://192.168.2.26:8088/api/public/dl/d68Ic_ru/buondua/' + this.title + '/' + i + '.jpg' })
                });

            }

            return items
        }

    }
}


