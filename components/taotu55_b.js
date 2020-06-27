
/*
输入：args参数idCode，就是第二层页面的参数
输出：就是第二层页面的排版
描述：
时间：2020年6月25日 16:54:17
*/
const get_indexRule = require('../script/indexRule')
module.exports ={
    type:'list',
    //author:'z',

    async fetch({args,page}){
        
        try{
            let items = []; //原来就是这个没有定义害我出错好久。
            let file_position = './script/taotu55.json';
            //console.log(args.idCode)
            let data = await get_indexRule(file_position, page,'galleryRule',args.idCode); //需要传入第三个参数

            page = data.pop();
            data.map(item=>{
                items.push({
                    style:'book', //具有image title属性
                    image: item.thumbnail,
                    route:$route('@image',{url:item.url}),
                    spanCount:4
                })
            })

            return {
                items:items,
                nextPage: page + 1 //他好像这里可以定义每次跳几页，但是我默认就是1了
            }
        }catch{
            $ui.toast('已经拉倒底部辣')
        }
        
    }
}


