const fetch = require('node-fetch');
const chalk = require('chalk');

var exports = module.exports = {};
let showInfo = false;
let requestBaseUri = '';

// 新建一个api 请求对象
let requestObj = function (obj) {
    // 默认值
    setting =  {
        url :'',
        method :'GET',
        headers : {},
        body : null,
    }
    Object.assign(setting,obj);

    this.url = setting.url;
    this.method = setting.method;
    this.headers = setting.headers;
    this.body = setting.body;
}
requestObj.prototype.clone = function() {
    return new requestObj({
        url:this.url,
        method:this.method,
        headers:JSON.parse(JSON.stringify(this.headers)),
        body:this.body,
    })
}
requestObj.prototype.withUrl = function (url) {
    newRequestObj = this.clone();
    newRequestObj.url=url;
    return newRequestObj;
}

requestObj.prototype.withHeader = function (key,value) {
    newRequestObj = this.clone();
    newRequestObj.headers[key]=value;
    return newRequestObj;
}

requestObj.prototype.withBasicAuth = function (username,passwd) {
    return this.withHeader('Authorization','Basic '+ Buffer.from(username+':'+passwd).toString('base64'));
}

requestObj.prototype.withBearerAuth = function (token) {
    return this.withHeader('Authorization','Bearer '+ token);
}

requestObj.prototype.withJsonBody =function (data) {
    newRequestObj = this.clone();
    newRequestObj.body = JSON.stringify(data);
    newRequestObj.headers['Content-Type'] = 'application/json';
    return newRequestObj;
}

requestObj.prototype.fetch = async function(rewriteMethod) {
    let res,body
    if(typeof(rewriteMethod)=="undefined") {
        rewriteMethod = this.method;
    }
    let options = {
        method: rewriteMethod,
        headers: new fetch.Headers(this.headers),
        body: this.body,
        redirect: 'follow',
        signal: null,
    };
    requestUrl = this.url;
    if (requestBaseUri != '') {
        requestUrl = requestBaseUri + requestUrl;
    }

    if (showInfo) {
      console.log('Api %s %s',chalk.yellow(rewriteMethod),chalk.yellow(this.url));
      console.log("Req Headers:\n %s",chalk.yellow(JSON.stringify(this.headers)));
    }

    res = await fetch(requestUrl,options);
    body = await res.text();

    return new responseObj(res.status,res.headers.raw(),body);
}

requestObj.prototype.get =  function () {
    return this.fetch('GET');
}

requestObj.prototype.post = function () {
    return this.fetch('POST');
}

requestObj.prototype.put = function () {
    return this.fetch('PUT');
}

requestObj.prototype.delete = function () {
    return this.fetch('DELETE');
}

requestObj.prototype.patch = function () {
    return this.fetch('PATCH');
}
// options 看上去像是个关键字？head不太用，要用了再说



let responseObj = function (status,headers,body) {
    this.status = status
    this.headers = JSON.parse(JSON.stringify(headers)) //TODO:研究下是不是还有必要保留这个转化逻辑
    this.body = body

    if (showInfo) {
      console.log("Res headers:\n%s",chalk.yellow(JSON.stringify(headers)));
      console.log("Res body:\n%s\n",chalk.yellow(this.body));
    }


}

exports.apiRequest = function () {
    return new requestObj();
}
exports.SetApiBaseUri = function(baseUri){
    requestBaseUri = baseUri
}
// 暴露给外部用于控制详细信息展示
exports.ShowApiInfo = function() {
  showInfo =true;
}