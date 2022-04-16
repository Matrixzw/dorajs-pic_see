module.exports = {
  type: 'bottomTab', //设置toptab bottomTab drawer都可以进一步展示，但是设置list就不行了




  async fetch() {
    return [
      {
        image: $icon('home'),
        title: '首页',
        route: $route('buondua_index', { url: base_url + '/' })
      }, {
        image: $icon('stars'),
        title: '热门',
        route: $route('buondua_index', { url: base_url + '/hot' })
      },{
        image: $icon('shopping_basket'),
        title: '合集',
        route: $route('buondua_index_tag', { url: base_url + '/collection' })
      }
    ]

  }
}
