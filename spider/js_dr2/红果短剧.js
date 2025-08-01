/*
@header({
  searchable: 2,
  filterable: 0,
  quickSearch: 0,
  title: '红果短剧'
})
*/

var rule = {
  title: '红果短剧',
  host: 'https://www.hongguodj.cc/',
  url: '/show/fyclass--------fypage---.html',
  searchUrl: '/search/**----------fypage---.html',
  class_parse: '.nav li;a&&Text;a&&href;.*/(.*?).html',
  searchable: 2,
  quickSearch: 0,
  filterable: 0,
  headers: {
    'User-Agent': 'MOBILE_UA',
  },
  play_parse: true,
  lazy: "js:\n  let html = request(input);\n  let hconf = html.match(/r player_.*?=(.*?)</)[1];\n  let json = JSON5.parse(hconf);\n  let url = json.url;\n  if (json.encrypt == '1') {\n    url = unescape(url);\n  } else if (json.encrypt == '2') {\n    url = unescape(base64Decode(url));\n  }\n  if (/\\.(m3u8|mp4|m4a|mp3)/.test(url)) {\n    input = {\n      parse: 0,\n      jx: 0,\n      url: url,\n    };\n  } else {\n    input = url && url.startsWith('http') && tellIsJx(url) ? {parse:0,jx:1,url:url}:input;\n  }",
  limit: 6,
  double: true,
  推荐: '.show&&ul;li;img&&alt;img&&data-src;.bg&&Text;a&&href',
  一级: '.list li;img&&alt;img&&data-src;.bg&&Text;a&&href',
  二级: {
    title: 'h2&&Text;.info p:eq(2)&&a&&Text',
    img: 'img&&src',
    desc: '.info p:eq(2)&&a&&Text;.info p:eq(3)&&a&&Text;.info p:eq(4)&&a&&Text;.info p:eq(0)&&a&&Text;.info p:eq(1)&&a&&Text',
    content: '#desc&&Text',
    tabs: '.play.my-2 .title&&a',
    lists: '.play-list:eq(#id)&&.rows li',
  },
  搜索: '.show.rows li;img&&alt;img&&data-src;.bg&&Text;a&&href',
}