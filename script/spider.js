const axios = require('axios');
const cheerio = require('cheerio')

var mysql = require('mysql');


async function get_first(url) {
    let items = []

    url = encodeURI(url)

    var $ = await get_$(url)

    lists = $('div[class="items-row column is-half-desktop is-half-tablet is-half-mobile"]')

    lists.each((i, ele) => {

        tag = $(ele).find('div[class= "item-tags tags"]>a').text().replace(/\s+/g, '');


        items.push({
            tag,
            title: $(ele).find('h2>a').text().trim(),
            second_url: $(ele).find('h2>a').attr('href'),
            img_url: $(ele).find('a>img').attr('data-src'),
        })
    })
    //console.log(items)
    return items

}




//get_first('https://buondua.com/tag/xing-meng-10829')

module.exports = {
    get_first,
    get_$,
    sql_add_data,
    sql_get_flag,
    sql_change_flag,
    sql_get_data,
    rpc_trans,
    sql_download
}


async function get_$(url, try_time = 5) {

    let raw_html = '';

    if (try_time) {
        try {
            //await time_delay(500)
            res = await axios(encodeURI(url), { timeout: 2000 });
        } catch {
            return get_$(url, try_time - 1)
        }
        //显示进行了几次操作之后获得的数据，一般都是一次就行了
        console.log('尝试次数：', 6 - try_time)
        raw_html = res.data;
        $ = cheerio.load(raw_html)
        return $
    } else {
        throw new Error('在进行五次尝试之后仍然没有获取到数据')
    }
}

//get_second(encodeURI('https://buondua.com/xiuren-no-4324-xing-meng-星萌-50-photos-25742'))

function time_delay(time) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}


//写入操作,
//数据格式
async function sql_add_data(sql_params) {
    var add_sql = '';
    if (sql_params.length == 4) {
        add_sql = `insert ignore into ${sql_table}(id, title, img_url, description) values(?, ?, ?, ?)`;
    } else {
        add_sql = `insert ignore into ${sql_table}(id, title, img_url) values(?, ?, ?)`;
    }
    connection.query(add_sql, sql_params, (err, result) => {
        if (err) {
            console.error(err)
        } else if (result.affectedRows == 0) {
            //console.log('没有进行更改操作，数据已存在')
            //console.log(sql_params)
        } else {
            //console.log('已经成功添加数据:')
            //console.log(sql_params)
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
                console.error('很可能这个error就是timeout')
                reject(0)
                //sql_get_flag(title, try_time - 1)
            } else {
                if (res.length == 0) {
                    // console.error(title)
                    //console.error('获取到了空的数组，就是代表没有缓存过数据');
                    resolve(0)
                }
                if (res[0]) {
                    resolve(res[0].flag)
                }
            };
        });


    })
}


async function sql_change_flag(flag, title) {
    connection.query(`update ${sql_table} set flag = ? where title = ?`, [flag, title + '-0'], (err, res) => {
        if (err) {
            console.error(err)
        } else {
            console.log('已经更改了flag的value：' + flag)
            //$ui.toast('已经成功完成注入最后的flag改为：' + flag)
        }
    });

}


//读取操作，利用了like关键字
function sql_get_data(title) {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${sql_table} where title like ? order by id`, title + '%', (err, res) => {
            //console.log(err)
            if (err) {
                reject(err)
            }
            resolve(res)
        });
    })
}


function sql_download(title) {
    return new Promise((resolve, reject) => {
        connection.query(`select * from ${sql_table} where title like ?`, title + '%', (err, res) => {
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



//data数组， {url, title} 下载地址， 默认为/mnt/aria2/image/
//不返回数据
//2022-2-8

function rpc_trans(data) {
    data.map((item, index) => {
        let dir = '/mnt/aria2/image/buondua/';
        let params = [
            [item.img_url],
            {
                dir,
                'out': item.title
            }
        ]
        let data = {
            jsonrpc: "2.0",
            id: item.title,
            method: "aria2.addUri",
            params: params
        };


        let config = {
            url: "http://192.168.2.26:6800/jsonrpc",
            data: data,
            method: "post",
        };

        axios(config).then(res => {
            //如果是第一个的时候，我们才输出
            if (index == 0) {
                console.log('正在执行rpc_trans函数')
                if (res.data.error == undefined) {
                    $ui.toast('正在执行下载......' + res.data.id)
                    console.log('保存的位置是：', dir)
                }
            }
        }, (err) => {
            if (index == 0) {
                console.error('在rpc_trans过程中出现错误' + err.code);
                $ui.toast('下载失败：' + res.data.id)
            }

        })
    })

}