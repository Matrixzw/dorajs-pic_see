const load = require("cheerio").load
module.exports = {
  type: 'list',
  async fetch({ args, page }) {
    let items = []
    b = ["最新-", "推荐-tuijian", "热门-remen", "周榜-zhoubang", "月榜-yuebang", "随机-suiji"]
    if ((page || 1) == 1 && !args.keyword && !args.tag) {
      b.map(data => {
        data = data.split("-")
        items.push({
          title: data[0],
          style: 'label',
          spanCount: 2,
          onClick: async () => {
            this.order = data[1]
            this.nextPage = 0
            this.refresh()
          }
        })
      })
    }
    let url = args.keyword ? `https://www.ystuji.com/search/${encodeURI(args.keyword)}/page/${page || 1}` : (args.tag ? `${args.tag}/page/${page || 1}` : `https://www.ystuji.com/${args.type}/page/${page || 1}?order=${this.order ? this.order : ""}`)
    let res = await $http.get(url)
    const $ = load(res.data)
    let list = $("li.swiper-slide")
    list.each((index, li) => {
      items.push(
        {
          image: $(".img>span>img", li).attr("data-original"),
          author: {
            name: $(".title", li).text()
          },
          route: $route("detail", { url: $(".title", li).attr("href") }),
          style: "gallery",
          spanCount: 6
        }
      )
    })
    return {
      items: items,
      nextPage: (page || 1) + 1
    }
  }
}
