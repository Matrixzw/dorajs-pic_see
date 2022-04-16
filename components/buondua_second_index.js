module.exports = {
    type: 'topTab', //设置toptab bottomTab drawer都可以进一步展示，但是设置list就不行了
    async fetch({ args }) {
        return [
            {
                title: '图片',
                route: $route('buondua_second', { second_url: args.second_url })
            }, {
                title: '其他作品',
                route: $route('buondua_second_2', { second_url: args.second_url, flag: 1 })
            }, {
                title: 'You May Like',
                route: $route('buondua_second_2', { second_url: args.second_url, flag: 2 })
            }
        ]

    }
}