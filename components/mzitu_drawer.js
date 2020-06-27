const mzitu_zhuanti = require("./mzitu_zhuanti");

module.exports = {
    type: 'topTab',
    //image: $icon('bookmarks'),
    author: {
        name: 'zz'
    },
    searchRoute: $route('mzitu'), 
    async fetch() {
        let list = [];
        args = [
            { title: '首页', href: '/' },
            { title: '性感妹子', href: '/xinggan/' },
            { title: '日本妹子', href: '/japan/' },
            { title: '台湾妹子', href: '/taiwan/' },
            { title: '清纯妹子', href: '/mm/' },
            { title: '热门妹子', href: '/hot/' },
            { title: '推荐妹子', href: '/best/' },
            // { title: '每日更新', href: '/all/' }
        ];
        args.map(res => {
            list.push({
                title: res.title,
                route: $route('mzitu', { href: res.href })
            })
        })

        list.push({
            title: '妹子自拍',
            route: $route('mzitu_zipai', { param: '/zipai/' })
        },
            {
                title: '街拍美女',
                route: $route('mzitu_zipai', { param: '/jiepai/' })
            }
        );

        list.push({
            title: '每日更新',
            route: $route('mzitu_all')
        }, {
            title: '美女专题',
            route: $route('mzitu_zhuanti')
        })

        return list
    }

}