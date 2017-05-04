var https = require('https');
var cheerio = require('cheerio');
var request = require('request');
var async = require('async');
var fs = require('fs');
var config = require('./config');

var quest_id = config.quest_id;
var ans_sum = config.ans_sum;
var folder = config.folder;

var url = 'https://www.zhihu.com/api/v4/questions/' + quest_id + '/answers?limit=20';
var ans_url = 'https://www.zhihu.com/question/' + quest_id + '/answer/';

var answers = [];
var img_urls = [];

var option = config.option;

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder);
}

async.waterfall([
    (cb_wf) => {
        var offset = 0;
        async.whilst(
            () => {
                return offset < ans_sum;
            },
            (cb_wh) => {
                var curr_url = url + "&offset=" + offset;
                option.url = curr_url;
                request(option, (err, res, body) => {
                    var result = JSON.parse(body);
                    result.data.forEach((ans) => {
                        var st = ans.url.indexOf('/answers/');
                        var ans_id = ans.url.substring(st+9);
                        answers.push(ans_id);
                    });
                    offset += 20;
                    cb_wh();
                });
            },
            (err) => {
                if (err) {
                    console.log(err);
                    cb_wf(err);
                } else {
                    console.log("Get answers finished.");
                    cb_wf();
                }
            }
        );
    },
    (cb_wf) => {
        var curr_ans = 0;
        async.whilst(
            () => {
                return curr_ans < answers.length;
            },
            (cb_wh) => {
                var curr_url = ans_url + answers[curr_ans++];
                option.url = curr_url;
                request(option, (err, res, body) => {
                    if (err || res.statusCode != 200) {
                        cb_wh(curr_url + ' Error');
                    } else {
                        console.log(2333, curr_url, 'finished');
                        var $ = cheerio.load(body);
                        var content = cheerio.load($('.RichContent-inner').html());
                        content('img').each((i, elem) => {
                            var img = content(elem).attr('src');
                            if (img.indexOf('whitedot.jpg') == -1) {
                                img_urls.push(img);
                            }
                        });
                        cb_wh();
                    }
                });
            },
            (err) => {
                if (err) {
                    console.log(err);
                    cb_wf(err);
                } else {
                    cb_wf();
                }
            }
        );
    }
], (err) => {
    if (err) {
        console.log(err);
    } else {
        var img_cnt = 0;
        console.log("Total", img_urls.length, "imgs. Now downloading....");
        async.whilst(
            () => {
                return img_cnt < img_urls.length;
            },
            (cb) => {
                var html = "";
                https.get(img_urls[img_cnt++], (res) => {
                    res.setEncoding('binary');
                    res.on('data', (data) => {
                        html += data;
                    });
                    res.on('end', () => {
                        fs.writeFileSync(folder+img_cnt+'.jpg', html, 'binary');
                        console.log(img_cnt, "img finished");
                        cb();
                    });
                });
            },
            (err) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Img download finished");
                }
                process.exit();
            }
        );
    }
});