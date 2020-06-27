

data = `<p><span class="header">识别码:</span> <span style="color:#CC0000;">MMRAA-153</span></p><p><span class="header">发行时间:</span> 2020-06-26</p><p><span class="header">长度:</span> 97分钟</p><p class="header">制作商: </p><p><a href="https://avmoo.host/cn/studio/fa9cd58cc97e8d20">スパイスビジュアル</a></p><p class="header">发行商: </p><p><a href="https://avmoo.host/cn/label/74a6ab6a33f329d0">MARE</a></p><p class="header">系列:</p><p><a href="https://avmoo.host/cn/series/7dd7025036c4605e">清純クロニクル</a></p><p class="header">类别:</p><p><span class="genre"><a href="https://avmoo.host/cn/genre/c4145926405d550f">单体作品</a></span><span class="genre"><a href="https://avmoo.host/cn/genre/998ecc028c00f104">偶像艺人</a></span><span class="genre"><a href="https://avmoo.host/cn/genre/644ddb48c6a4db96">介绍影片</a></span><span class="genre"><a href="https://avmoo.host/cn/genre/5f9f62d40baa77cf">高画质</a></span></p>`

console.log(/制作商/.test(data))



if(/导演/.test(data)){
    console.log( data.match(/导演.*?<a href="(http.*?)">(.*?)<\/a>/)[2]);
    console.log( data.match(/导演.*?<a href="(http.*?)">(.*?)<\/a>/)[1]);     
};