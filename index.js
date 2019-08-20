const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const wkhtmltopdf = require('wkhtmltopdf');
const CONFIG = require('./config');

/**
 * 
 * @param {string} contentPath : 需要爬取页面的url
 */
async function vp_print(contentPath, print_index) {
    const filename = Array.prototype.pop.call(contentPath.split('/')).split('.')[0];
    const content_class = `div.${CONFIG.content_class_name}` || 'content';
    const style_links = CONFIG.style_link_tags.join('');
    const res = await axios({
        method: 'get',
        url: encodeURI(contentPath),
    })

    const pageHTML = res.data;
    const $ = cheerio.load(pageHTML);
    const head = $('head').html();
    const content = $(`${content_class}`).html();
    const concat = `
    <html>
        <head>
            ${CONFIG.style_link_tags.join(' ')}
        </head> 
        <body>
            <div>${content}</div>
        </body>
    </html>`;
    wkhtmltopdf(concat, {
        output: `${process.cwd()}/output/${CONFIG.folder_name}/[${print_index}] - ${filename}.pdf`,
        // pageSize: 'A4'
    }, function (err) {
        if(err) {
            console.log(`[index:${print_index} error] - ${filename}.pdf error`);
            return console.log(err)

        }
        console.log(`[index:${print_index} success] - ${filename}.pdf print`);
    })

}

async function vp_print_sliderbar(sliderbarPath) {
    const base_url = CONFIG.host;
    
    const pageHTML = await axios.get(CONFIG.page_url).then(res => res.data);
    const $ = cheerio.load(pageHTML);
    const sliderBar = $('ul.sidebar-links').html();
    const lis = cheerio.load(sliderBar)("a");
    const linkArr = [];

    for (let item of Array.from(lis)) {
        const link = base_url + item.attribs['href'];
        // 去除链接的 #
        const removedSymbolLink = Array.prototype.shift.call(link.split('#'));
        linkArr.push(removedSymbolLink);
    }
    
    new Promise(function (resolve, reject) {
        wkhtmltopdf(sliderBar, {
            output: sliderbarPath || `${process.cwd()}/output/${CONFIG.folder_name}/slider.pdf`,
            pageSize: 'A4'
        }, function (err) {
            if (err) return reject(err);
            return resolve('slider print success')
        })
    }).then(res => {
        console.log(res)
    }).catch(err => console.log)
    
    console.log(Array.from(new Set(linkArr)));
    return Array.from(new Set(linkArr));
}

(async function () {
    try {
        fs.statSync(`${process.cwd()}/output/${CONFIG.folder_name}`);
    } catch(e) {
        fs.mkdirSync(`${process.cwd()}/output/${CONFIG.folder_name}`);
    }
    // get slider bar links
    const linkArr = await vp_print_sliderbar();
    
    // get content pages
    linkArr.forEach(async (item, index) => {
        await vp_print(item, index);
    })
})()