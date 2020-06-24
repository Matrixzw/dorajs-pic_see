module.exports = {
  type: 'topTab',
  tabMode:"fixed",
  searchRoute: $route('list'),
  async fetch() {
    return [
    {
      title:"清纯",
      route:$route("list",{type:"qingchun"})               
    },
    {
      title:"动漫",
      route:$route("list",{type:"dongman"})               
    },
    {
      title:"性感",
      route:$route("list",{type:"xinggan"})               
    },
    {
      title:"明星",
      route:$route("list",{type:"mingxing"})               
    }        
    ]

  }
}
