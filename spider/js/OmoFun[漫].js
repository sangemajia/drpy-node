/*
@header({
  searchable: 2,
  filterable: 0,
  quickSearch: 0,
  title: 'OmoFun'
})
*/

class Rule {
    类型 = '影视';
    title = 'OmoFun';
    desc = 'http://fb.omofun.one';
    host = 'https://omofunw.com';
    homeUrl = '/';
    url = '/index.php/vod/show/id/fyclass/page/fypage.html';
    searchUrl = '/index.php/vod/search/page/fypage/wd/**.html';
    searchable = 2;
    quickSearch = 0;
    timeout = 5000;
    play_parse = true;

    async class_parse() {
        let classes = [
            {type_id: '22', type_name: '动漫电影'},
            {type_id: '23', type_name: '欧美动漫'},
            {type_id: '20', type_name: '日本动漫'},
        ];
        return {class: classes,}
    }

    async 预处理() {
    }

    async 推荐() {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.hl-vod-list li');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, '.hl-lazy&&data-original'),
                desc: pdfh(it, '.public-list-prb&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    }

    async 一级(tid, pg, filter, extend) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.hl-vod-list li');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, '.hl-lazy&&data-original'),
                desc: pdfh(it, '.public-list-prb&&Text'),
                url: pd(it, 'a&&href'),
            })
        });
        return setResult(d)
    }

    async 搜索(wd, quick, pg) {
        let {input, pdfa, pdfh, pd} = this;
        let html = await request(input);
        let d = [];
        let data = pdfa(html, '.hl-one-list.hl-theme-by li');
        data.forEach((it) => {
            d.push({
                title: pdfh(it, 'a&&title'),
                pic_url: pd(it, '.hl-lazy&&data-original'),
                desc: pdfh(it, '.hl-pic-text&&Text'),
                url: pd(it, 'a&&href'),
                content: pdfh(it, 'p:eq(0)&&Text'),
            })
        });
        return setResult(d)
    }

    async 二级(ids) {
        let {
            input,
            pdfa,
            pdfh,
            pd
        } = this;
        let html = await request(input);
        let VOD = {};
        VOD.vod_name = pdfh(html, 'h2&&Text');
        VOD.vod_content = pdfh(html, '.hl-col-xs-12.blurb&&Text');
        let playlist = pdfa(html, '#hl-plays-list')
        let tabs = pdfa(html, '.hl-plays-from.hl-tabs a');
        let playmap = {};
        tabs.map((item, i) => {
            const form = pdfh(item, 'Text')
            const list = playlist[i]
            const a = pdfa(list, 'body&&a:not(:contains(展开))')
            a.map((it) => {
                let title = pdfh(it, 'a&&Text')
                let urls = pd(it, 'a&&href', input)
                if (!playmap.hasOwnProperty(form)) {
                    playmap[form] = [];
                }
                playmap[form].push(title + "$" + urls);
            });
        });
        VOD.vod_play_from = Object.keys(playmap).join('$$$');
        const urls = Object.values(playmap);
        const playUrls = urls.map((urllist) => {
            return urllist.join("#")
        });
        VOD.vod_play_url = playUrls.join('$$$');
        return VOD
    }

    async lazy(flag, id, flags) {
        let {input} = this
        const html = JSON.parse((await req(input)).content.match(/r player_.*?=(.*?)</)[1]);
        let url = html.url;
        if (html.encrypt == "1") {
            url = unescape(url)
            return {parse: 0, url: url}
        } else if (html.encrypt == "2") {
            url = unescape(base64Decode(url))
            return {parse: 0, url: url}
        }
        if (/m3u8|mp4/.test(url)) {
            input = url
            return {parse: 0, url: input}
        } else {
            return {parse: 0, url: input}
        }
    }
}

rule = new Rule();
