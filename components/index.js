module.exports = {
  type: 'bottomTab', //设置toptab bottomTab drawer都可以进一步展示，但是设置list就不行了




  async fetch() {
    return [
      {
        title: 'taotu55',
        route: $route('taotu55')
      },
      {
        title: '妹纸图',
        route: $route('mzitu_drawer'),
        image: $icon('home'),
      },
      {
        title: "avmoo",
        route:$route('avmoo')
        
      },
      {
        title: '下载文件',
        route: $route('testpage')
      }


    ]

  }
}
