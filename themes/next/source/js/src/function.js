function getClass(tagName, className) //获得标签名为tagName,类名className的元素
{
    if (document.getElementsByClassName) //支持这个函数
    {
        return document.getElementsByClassName(className);
    } else {
        var tags = document.getElementsByTagName(tagName); //获取标签
        var tagArr = []; //用于返回类名为className的元素
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].class == className) {
                tagArr[tagArr.length] = tags[i]; //保存满足条件的元素
            }
        }
        return tagArr;
    }
}

function addEvent(obj, type, fn) {
    if (obj.addEventListener) obj.addEventListener(type, fn, false);
    else if (obj.attachEvent) obj.attachEvent('on' + type, fn);
    else obj['on' + type] = fn;
}

function removeEvent(obj, type, fn) {
    if (obj.removeEventListener) obj.removeEventListener(type, fn, false);
    else if (obj.detachEvent) obj.detachEvent('on' + type, fn);
    else obj['on' + type] = null;
};

function resizePos(obj, callback) {
    if (typeof callback == "function") {
        addEvent(window, 'scroll', function() {
            callback(obj);
        });
        addEvent(window, 'resize', function() {
            callback(obj);
        });
    }
}

function getBrowser(getVersion) {
    //注意关键字大小写
    var ua_str = navigator.userAgent.toLowerCase(),
        ie_Tridents, trident, match_str, ie_aer_rv, browser_chi_Type;

    //判断IE 浏览器,
    //blog: http://blog.csdn.Net/aerchi/article/details/51697592
    if ("ActiveXObject" in self) {
        // ie_aer_rv:  指示IE 的版本.
        // It can be affected by the current document mode of IE.
        ie_aer_rv = (match_str = ua_str.match(/msie ([\d.]+)/)) ? match_str[1] :
            (match_str = ua_str.match(/rv:([\d.]+)/)) ? match_str[1] : 0;

        // ie: Indicate the really version of current IE browser.
        ie_Tridents = { "trident/7.0": 11, "trident/6.0": 10, "trident/5.0": 9, "trident/4.0": 8 };
        //匹配 ie8, ie11, edge
        trident = (match_str = ua_str.match(/(trident\/[\d.]+|edge\/[\d.]+)/)) ? match_str[1] : undefined;
        browser_chi_Type = (ie_Tridents[trident] || ie_aer_rv) > 0 ? "internet-explorer" : undefined;
    } else {
        //判断 windows edge 浏览器
        // match_str[1]: 返回浏览器及版本号,如: "edge/13.10586"
        // match_str[1]: 返回版本号,如: "edge"
        //若要返回 "edge" 请把下行的 "ie" 换成 "edge"。 注意引号及冒号是英文状态下输入的
        browser_chi_Type = (match_str = ua_str.match(/edge\/([\d.]+)/)) ? "edge" :
            //判断firefox 浏览器
            (match_str = ua_str.match(/firefox\/([\d.]+)/)) ? "firefox" :
            //判断chrome 浏览器
            (match_str = ua_str.match(/chrome\/([\d.]+)/)) ? "chrome" :
            //判断opera 浏览器
            (match_str = ua_str.match(/opera.([\d.]+)/)) ? "opera" :
            //判断safari 浏览器
            (match_str = ua_str.match(/version\/([\d.]+).*safari/)) ? "safari" : undefined;
    }

    //返回浏览器类型和版本号
    var verNum, verStr;
    verNum = trident && ie_Tridents[trident] ? ie_Tridents[trident] : match_str[1];
    verStr = (getVersion != undefined) ? browser_chi_Type + "/" + verNum : browser_chi_Type;
    return verStr;
}
