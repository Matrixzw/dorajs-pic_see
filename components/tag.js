const load=require("cheerio").load
module.exports = {
  type: 'list',
  async fetch({ args, page }) {
    let items=[]
    let action=[]
    let url="https://www.ystuji.com/fenlei"    
    let res = await $http.get(url)
    const $ = load(res.data)
    let list = $("ul.post_tags>li")
    list.each((index, li) => {
      action.push(
      {
       title:$("a",li).text(),
       route:$route("list",{tag:$("a",li).attr("href")})      
      }                
      )     
      })
      items.push({
        title: '热门标签',
        style: 'chips',
        actions: action
      })
      return items
  }
}
