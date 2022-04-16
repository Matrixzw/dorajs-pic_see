module.exports = {
  type: 'bottomTab', //设置toptab bottomTab drawer都可以进一步展示，但是设置list就不行了




  async fetch() {
    return [
      {
        title: 'buondua',
        route: $route('buondua_index', { url: base_url + '/' })
      }
    ]

  }
}
