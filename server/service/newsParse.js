/**
 * Created by Administrator on 2019/2/16.
 * 获取广外外事新闻数据并进行一系列存储及解析操作
 */

const co = require('co');
const fs = require('fs');
const oss = require("ali-oss");
const cheerio = require('cheerio');
const request = require('request');
const uuidv1 = require('uuid/v1');
const utilTool = require('./utilTool');
const data = require('../data');

//初始化阿里云oss存储操作
const client = new oss(data.setting['ossInit']);

//其他一些变量
const gdufsHtmlPrefix = 'gdufs/knowledge/html/';
const gdufsResourceUrl = 'http://internationaloffice.gdufs.edu.cn';

/**
 * 1、http请求爬取广外外事新闻数据
 * 2、对新闻内容进行解析及OSS存储
 */
let newsHttpRequestAndParse = function (bodyData) {
    //爬取广外外事新闻HTML数据
    request(bodyData['origin_url'], function (error, response, body) {
        //用cheerio插件解析该HTML内容
        let $ = cheerio.load(body);
        let paragraphs = $('#vsb_content p'); //获取所有段落p元素数据
        let tempImgIndex = -10; //用来标识图片所在段落位置，用于查找图片下一段居中加粗来描述图片内容的特殊文本
        let content = ''; //即将存储到oss中的HTML拼接内容

        //对段落文本及图片资源重新HTML存储
        for (let i in paragraphs) {
            //若为数组标识号则进行元素解析，否则不解析
            if (!isNaN(i)) {
                //查找该p元素下的子图片元素
                let tempImg = $(paragraphs[i]).find('img');

                //图片
                if (tempImg.length > 0) {
                    //获取图片url
                    let imgUrl = gdufsResourceUrl + tempImg[0]['attribs']['src'];
                    //TODO (暂时不应用) 图片资源存储到云端oss中
                    content += '<p style="text-align: center"><img src="' + imgUrl + '" style="width: 80%;height: auto"/></p>\n';
                    //重置图片所在位置的index
                    tempImgIndex = i;
                }
                //文本
                else {
                    //图片描述文本，居中加粗
                    if (parseInt(tempImgIndex) + 1 == i) {
                        content += '<p style="text-align: center; font-weight: bold">' + $(paragraphs[i]).text() + '</p>\n'
                    }
                    //普通文本，居左处理
                    else {
                        content += '<p style="text-indent: 2em; margin: 5px 0">' + $(paragraphs[i]).text() + '</p>\n';
                    }
                }
            }
        }

        //content内容存储到oss中, 无需删除，直接覆写即可
        co(function*() {
            let fileName = gdufsHtmlPrefix + bodyData['unique_id'] + ".html";
            var result = yield client.put(fileName, Buffer.from(content, 'utf-8'));

            //保存成功
            if (result['res']['status'] == 200) {
                console.log('save oss news file success',bodyData['unique_id'], utilTool.getCurrentDataTime());
            }

        }).catch(function (err) {
            console.error(err, 11, utilTool.getCurrentDataTime())
        });

    });
};


module.exports = {
    newsHttpRequestAndParse: newsHttpRequestAndParse,
};