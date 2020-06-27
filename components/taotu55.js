

const get_indexRule = require('../script/indexRule')


/*
来自：index.js 进入页面首先看到的就是这个
*/
module.exports = {
    type: 'list',
    async fetch({page }) {
        let items = [];


        try {
            
            let file_position = './script/taotu55.json';
            let data = await get_indexRule(file_position, page);
            $permission.request('sdcard');
            console.log(data.slice(-4,5))
            page = data.pop();
            data.map((item) => {

                // console.log(index);
                items.push({
                    style: 'vod', //具有title, thumb, label, summary.
                    image: item.cover||'', //好像thumb
                    title: item.title||'',
                    summary:item.datetime||'',
                    label:item.category||'',
                    spanCount: 3,
                    route: $route('taotu55_b',{idCode:item.idCode}) //跳转的路由等会要修改这里
                })
            }) 

                    

            return {
                items: items,
                nextPage: page + 1 //他好像这里可以定义每次跳几页，但是我默认就是1了
            }

        }catch{
            err => {
                
                console, log('就算不运行这个err重要出来吧',err)
            }

        }
    }
}

