module.exports = {
  type: 'bottomTab', //设置toptab bottomTab drawer都可以进一步展示，但是设置list就不行了

  searchRoute: $route('mzitu'), //其实还是转到第一层页面的

  

  async fetch() {
    return [
    {
      title: '妹纸图',
      route: $route('mzitu_drawer'),
      image: $icon('home'),
    }
    ]

  }
}
