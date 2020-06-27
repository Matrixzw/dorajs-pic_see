

module.exports ={
    type: 'topTab',

    async fetch(){
        return [{
            title: '首页',
            route: $route('avmoo_index',{url:'https://avmoo.host/cn/'})
        }]
    }
}