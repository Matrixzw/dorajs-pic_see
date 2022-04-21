let axios = require('axios')

const { get_$ } = require('./spider');

async function test(second_url) {

    items = []

    page = 1

    let $ = await get_$(second_url)
    this.subtitle = $('div.article-info').text()
    if (!page) {

        this.all_page = $('div.pagination-list').eq(0).find('span').length

        let actions = [];
        tag_lists = $('div.article-tags').eq(0).find('div.tags>a')
        tag_lists.each((i2, ele2) => {
            actions.push({
                title: $(ele2).find('span').text(),
                route: $route('buondua_index', { url: encodeURI(base_url + $(ele2).attr('href')) })
            })
        })

        items.push({
            style: 'chips',
            title: this.title + '\t' + $('div.article-info').text(),
            actions
        })
    }

    lists = $('div.article-fulltext>p')

    page = page ? page : 1;

    lists.each((i, ele) => {
        items.push({
            style: 'book',
            title: ((page - 1) * 20) + i + 1,
            spanCount: 6,
            image: $(ele).find('img').attr('data-src'),
            // route: $route('@image', { url: $(ele).find('img').attr('data-src') })
        })
    });

    nextPage = page + 1;
    console.log(items)
    return items

    if (nextPage <= this.all_page) {
        return {
            items,
            nextPage
        }
    } else {
        // $ui.toast(`${this.all_page}页图片加载完毕`)
        return items

    }
}

//test('https://buondua.com/coser-%E6%B0%B4%E6%B7%BCaqua-vol-115-120-photos-25805')


var mysql = require('mysql')

//开始各种函数的配置


connection = mysql.createConnection({
    host: '192.168.2.26',
    user: 'zzw',
    password: 'admin',
    port: '3306',
    database: 'xiuren'
});

sql_table = 'buondua_data'
sql_params = [0, 'Coser@水淼aqua Vol.115: (120 photos)-0', 'https://i0.wp.com/kul.mrcong.com/images/2022/04/20/Coser-aqua-Vol.115-MrCong.com-015.webp?q=90&f=auto']


sql_get_data('Coser@水淼aqua Vol.115: (120 photos)').then(res=>{
    console.log(res)
})
connection.end()

//写入操作
function sql_add_data(sql_params, flag) {
    var add_sql = '';
    if (flag == 0) {
        add_sql = `insert ignore into ${sql_table}(id, title, img_url, description) values(?, ?, ?, ?)`;
    } else {
        add_sql = `insert ignore into ${sql_table}(id, title, img_url) values(?, ?, ?)`;
    }
    connection.query(add_sql, sql_params, (err, result) => {
        if (err) {
            console.error(err)
        } else if (result.affectedRows == 0) {
            console.log('没有进行更改操作，数据已存在')
            console.log(sql_params[0])
        } else {
            console.log('已经成功添加数据:')
            console.log(sql_params[0])
        }
    });

}

//输入一个title，然后安装title去找，如果是有的话就返回flag中的数据，0表示有缓存，1表示缓存完毕，其他数据表示已经下载了
//如果没有表格的话，就返回false
function sql_get_flag(title) {
    return new Promise((resolve, reject) => {
        connection.query(`select flag from ${sql_table} where title = ?`, title, (err, res) => {
            //console.log(err)
            if (err) {
                reject('some thing was wrong! in get_flag function')
            }
            if (res.length == 0) {
                // console.error(title)
                console.error('获取到了空的数组，就是代表没有缓存过数据');
                resolve(null)
            }
            if (res[0].flag == 0) {
                resolve(res[0].flag)
            }
        })

    })
}
// get_flag('[XIUREN秀人网]NO.4749_模特唐安琪珠三角旅拍古装拍摄粉色性感肚兜秀完美身材诱惑写真75P').then(res=>{
//     console.log(res)
// })


//读取操作
function sql_get_data(title) {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${sql_table} where title like ? order by id`, title +'%', (err, res) => {
            //console.log(err)
            if (err) {
                reject('some thing was wrong! in ')
            }
            resolve(res)
        })

    })
}




async function sql_change_flag(flag, title) {
    connection.query(`update ${sql_table} set flag = ? where title = ?`, [flag, title + '-0'], (err, res) => {
        if (err) {
            console.error(err)
        } else {
            console.log('已经更改了flag的value：' + flag)
            $ui.toast('已经成功完成注入最后的flag改为：' + flag)
        }
    })
}


function sql_download(title) {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${sql_table} where title regexp ?`, title.replace(/\[|\]/g, '.'), (err, res) => {
            if (err) {
                console.error('在sql_download中的地方出错了')
                console.error(err)
            } else if (res) {
                let items = [];
                res.map(item => {
                    items.push({
                        title: title + '/' + item.id + '.jpg',
                        img_url: item.img_url
                    })
                })
                resolve(items)
            } else {
                reject(res)
            }
        })


    })

}

//sql_download('[XIAOYU画语界]VOL.734_女神杨晨晨YOME丽江心愿旅拍杏色低胸服饰配肉丝完美诱惑写真99P')



if(null == false){
    console.log('afads')
}