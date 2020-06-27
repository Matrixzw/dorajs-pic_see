const file_get = require("../script/file_get")


module.exports = {
    type: 'list',

    async fetch() {
        var url = 'http://wximg.233.com/attached/image/20160815/20160815162505_0878.png'
        var filepath = '/sdcard/data/data/com.linroid.dora/files/Download/';
        var name = 'testimage123.jpg';


        return [{
            title: '下载功能',
            summary: 'adfafa',
            onClick: () => {
                $ui.toast('现在重要有一个数据吧')
                $permission.request('sdcard');
                headers ={
                    referer:'https://m.mzitu.com/'
                }
                $downloader.add({
                    url:  'https://pic.taotu55.net/tuku123/2020/allimg/200612/12144P2-9-V62.jpg',
                    
                    filename: 'adfkkkadfaf.png', //下载的时候不支持设置头部文件
                });
                console.log($downloader)
                console.log('afadafd')
            }
        }
        ]

    }

}
