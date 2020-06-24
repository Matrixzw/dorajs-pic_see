

spider = require('../assets/spider')

module.exports = {
    type: 'list',
    async fetch({ args, page }) {
        let items = [];
       // console.log(args)
        try {
            url = typeof(page)=='string' ? page : 'https://m.mzitu.com'+args.param;
            console.log(typeof(page)=='string')
            let data = await spider.spider_mizitu_m_zipai(url);
           // console.log(data);

            let info = data.pop();
            //console.log(info.next_url)
            //console.log(this.title,this.subtitle) 他自己带了一个title，妹子自拍，然后不好修改
            this.subtitle = info.title;

            data.map((item) => {

                // console.log(index);
                items.push({
                    style: 'book',
                    image: item.image_url,
                    title: item.date_time,
                    spanCount: 4,
                    route: $route('@image',{url:item.image_url})
                })
            }) 

            
            //console.log('adfafd', items)

            return {
                items: items,
                nextPage: info.next_url
            }

        } catch{
            err => {
                console, log(err)
            }

        }
    }
}