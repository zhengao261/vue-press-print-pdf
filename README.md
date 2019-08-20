# vue-press-print-pdf

一个将 vuepress 博客博文，保存并生成本地 pdf 文件的小工具。

### Release version 1.0.1

    * [Feat] 已经完成对基本内容的获取与生成pdf功能。
    * [Feat] 对一些配置进行抽象。
    * [Feat] 优化了一些重复获取资源的问题。

### config 

```js
{
    // 主域 
    host: '',
    
    // spider page url
    page_url: 'http://www.conardli.top/docs/JavaScript/',
    
    // output pdf folder name for in folder 'output'
    folder_name: 'js-code-x',
    
    // content_class_name
    content_class_name: 'content__default',
    
    // style link address to download css
    style_link_tags: [
        '<link rel="preload" href="http://www.conardli.top/docs/assets/css/0.styles.822cf4f6.css" as="style">',
        '<link rel="stylesheet" href="http://www.conardli.top/docs/assets/css/0.styles.822cf4f6.css">'
    ]
}
```

### todo

* [ ] to start local Server to add assets。
* [ ] algorithm optimization


