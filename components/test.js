
url_m = '1';
if (undefined) {
    console.log('true')
} else {
    console.log('fdakjk' + '/page/2/');
    console.log(/(\d+)\/?$/.exec(url_m));
    if (/(\d+)\/$/.exec(url_m)) {
        console.log(url_m.replace(/\d+\/$/, Number(/(\d+)\/$/.exec(url_m)[1]) + 1))
    }
}


page_function = (page) => {
    if (page) {
        return page.replace(/\d+\/$/, Number(/(\d+)\/$/.exec(page)[1]) + 1 + '/')
    } else {
        return 'https://m.mzitu.com/page/2/'
    }
}

console.log(page_function(null))

console.log((null || 1) + 1)

console.log('1/76页'.replace('页', ''))


// const spider = require('../assets/spider')
// const axios = require('axios')
// const cheerio = require('cheerio')
// url = 'https://www.mzitu.com/xinggan/'
// axios.get(url).then(res => {
//     const $ = cheerio.load(res.data);
//     list = $('ul.menu>li>a')
//     items = [];
//     for (i = 1; i < list.length; i++) {
//         title = list.eq(i).attr('title');
//         href = list.eq(i).attr('href');
//         href = /com(\/.*?)$/.exec(href)[1] || ''
//         items.push({ title, href });
//     }
//     console.log(items)
// })






console.log(encodeURI('杨晨'))


// setTimeout(myFunc, 1500, 'funky');

console.log(1 || 0)


list = [];
args = [
    { title: '性感妹子', href: '/xinggan/' },
    { title: '日本妹子', href: '/japan/' },
    { title: '台湾妹子', href: '/taiwan/' },
    { title: '清纯妹子', href: '/mm/' },
    { title: '妹子自拍', href: '/zipai/' },
    { title: '街拍美女', href: '/jiepai/' },
    { title: '每日更新', href: '/all/' }
];

args.map(res => {
    list.push({
        title: res.title,
        hrefada: res.href
    })
})

a = 123
if(undefined==undefined){
    console.log('yes')
}else{
    console.log('nadafjk')
}

str = 'ad:ad,adfm,adf,adf,ad',
str1 = 'daad:aa,af'.split(/[,:]/);
str1.shift();
console.log(str1)

var array = {aada:'adfa'};
// v 为数组中的值 i 为数组中的key
switch(1){
    case 1: console.log('afasd adfa ');
    break;
    case 2: console.log('adfasd')
}

data_show =[];
if(1){
    let str = 'afd:adfds,daf'.split(/[:,]/);
    str.shift();
    str.map(item=>{
        data_show.push({
            style: 'chips',
            title: item,
           // route:$route(mzitu_tag,{tag:item})
        })
    })
}


console.log(data_show)


list = [{a:'daf'}, {b:'dafad'},{c:'adfd'}];
list[1]=1;
console.log(list)