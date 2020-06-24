const load=require("cheerio").load
nexp=null
i=1
module.exports = {
  type: 'list',
  async fetch({ args, page }) {
    let url = ((page||1)==1)?args.url:nextp //最后一页赋值给了null
    if(url){ //如果是null，则整个不执行
    let res = await $http.get(url)
    const $ = load(res.data)
    let img = $(".sg_img1>a>img").attr("src")
    let next = $("em+a").text()
    if(next.indexOf("下一页")!="-1")
    {
      nextp="https://www.ystuji.com"+$("em+a").attr("href")
      console.log(nextp)
    }
    else{
      nextp=null //如果是最后一页，就是null nextpage
    }
    let items=[{
      image:img,
      spanCount:6,
      author:{
        name:i++
      },
      route:$route("@image",{url:img}),
      style:"gallery"
    }]
    
   // console.log(img)
    return {
      items:items,
      nextPage:(page||1)+1
    }}
    
  }
}
