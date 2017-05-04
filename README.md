# Zhihu Image Crawler

一个爬取知乎答案中的图片的小爬虫

# Implement

使用async进行异步控制。

使用request和https模块进行网络请求，爬取HTML页面，然后用cheerio进行页面DOM分析，提取图片地址。

# How to Run

1. git clone
2. 命令行切目录下，执行<code>npm install</code>安装依赖的模块
3. 修改<code>config.js</code>中的配置信息
4. 运行<code>npm start</code>或<code>node index.js</code>开始爬取

# Todo List Later

* 错误处理
* ....