/**
 * Created by rplees on 3/8/16.
 */
String.prototype.replaceAll = function(reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi": "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

/**
 * Created by Administrator on 13-12-20.
 */
const NullUtils = {
    NULL: "NULL",
    isNotNull: function(o) {
        return o != null && o != undefined;
    },
    isNull: function(o) {
        return !this.isNotNull(o);
    }
}

const JsonUtils = {
    encode(json){
        if (NullUtils.isNull(json)) {
            return '';
        }

        var tmps = [];
        for (var key in json) {
            tmps.push(key + '=' + json[key]);
        }

        return tmps.join('&');
    }
}

const StringUtils = {
    isBlank: function(s) {
        if(!s) {
            return true;
        }

        if(s == "" || (s.match && s.match(/^\s+$/g))) {
            return true;
        }

        return false;
    },

    isNotBlank: function(s){
        return !this.isBlank(s);
    },

    equals: function(s1, s2) {
        return s1 == s2;
    },

    equalsIgnoreCase: function(s1, s2){
        if(s1 == s2) {
            return true;
        }

        if(NullUtils.isNull(s1) || NullUtils.isNull(s2)) {
            return false;
        }

        return s1.toLocaleUpperCase() == s2.toLocaleUpperCase();
    },

    subString: function(s, start, len) {
        if(this.isBlank(s)) {
            return s;
        }

        return s.substr(start, len);
    },
}

CollectionUtils = {
    isEmpty: function(o) {
        if(! o) return true;

        var list = null;
        if(o instanceof  Array) {
            list = o;
        } else if(o.list) {
            list = o.list;
        } else if(o.items) {
            list = o.items;
        }
        //后续继续

        if(!list || list.length < 1) {
            return true;
        }

        return false;
    },

    isNotEmpty: function(o) {
        return !this.isEmpty(o);
    },
    removeIndex: function(array,index) { // array.splice(index, 1)
        var pop = array.splice(index, 1);
        return pop;
    }
}

NumberUtils = {
    /**
     * 向上取整
     */
    ceil: function(s){
        var v = Math.ceil(s);
        if(isNaN(v)) {
            return -1;
        }

        return v;
    },

    toInt: function(s) {
        return parseInt(s);
    },

    isNumber: function(o) {
        if(o instanceof Number) {
            return true;
        }
        return this.toInt(o) == o
    },

    toLocaleString: function(num) {
        if(num < 1000) {
            return num + "";
        }

        var retV = "";
        var wasContinue = true;
        var tempV = 0;
        while(wasContinue == true) {
            tempV = num%1000;
            num = this.toInt(num/1000);
            wasContinue = num >= 1;

            if(wasContinue) {
                if(tempV < 10) {
                    tempV = "00" + tempV;
                }else if(tempV < 100) { //少于三位数 补0
                    tempV = "0" + tempV;
                }
            }
            retV = tempV + retV;

            if(wasContinue) {
                retV = "," + retV;
            }
        }

        return retV;
    },

    getNumberFromLocaleString: function(stringValue) {
        return this.toInt(stringValue.replaceAll(",", ""));
    }
}

BooleanUtils = {
    parseBooleanWithDefault: function(o, defaultValue) {
        if(o == null || o == undefined) {
            return defaultValue;
        }

        return this.parseBoolean(o);
    },
    parseBoolean: function(o) {
        if(o == null || o == undefined) {
            return false;
        }

        if(o instanceof  Number) {
            return o != 0;
        }

        if(o == "true" || o == "TRUE" || o == true)
            return true;

        return false;
    }
}

// 表单验证
const TextUtils = {

    isPhone: function(phone) {
        var myreg = /^\d{11}$/;
        if(!myreg.test(phone)) {
            return false;
        }

        return true;
    },
    /*
     * 是否邮件地址
     * */

    isEmail: function(email) {
        var res = email.match(/\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/);
        if (res !== null) {
            return res[0];
        }
        return false;
    },
    /**
     * 是否仅数字和字母
     * @param str
     * @param min 最小长度 默认0
     * @param max 最大长度 默认最大10000
     * @returns {boolean}
     */
    isNumberCharacter: function (str, min, max) {
        min = min || 1;
        max = max || 10000;
        var len = str.length;
        if (min > len || len > max) {
            return false;
        }
        var res = new RegExp(/^[a-z0-9]+$/i);
        return res.test(str);
    },

    /**
     * 是否URL格式
     * @param str
     * @returns {*}
     */
    isHttp: function(str) {
        var regHttp = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i;
        var resRegHttp = str.match(regHttp);

        if (resRegHttp) {
            return resRegHttp[0];
        }
        return false;
    }
}

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+" : this.getMonth()+1,                 //月份
        "d+" : this.getDate(),                    //日
        "h+" : this.getHours(),                   //小时
        "m+" : this.getMinutes(),                 //分
        "s+" : this.getSeconds(),                 //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S"  : this.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
        if(new RegExp("("+ k +")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
}
const DateUtils = {
    format: function(dateTimeStamp){
        return DateUtils.formatDate(dateTimeStamp, "yyyy-MM-dd hh:mm:ss");
    },

    formatDate: function(dateTimeStamp, f){
        return new Date(dateTimeStamp).format(f);
    },

    formatDiff: function(dateTimeStamp){//FIXME:该函数是与当前时间比较,几个小时前\几天前格式化显示
        return new Date(dateTimeStamp).format("yyyy-MM-dd");
    }
}

const ObjUtils = {
    toString : function(o) {
        if(NullUtils.isNull(o)) {
            return "null";
        }

        if((typeof o) == "string") {
            return o;
        } else if((typeof o) == "object") {
            var s = "";
            for(var idx in o) {
                s += idx + "=" + ObjUtils.toString(o[idx]) + ",";
            }

            return s;
        } else if((typeof o) == "funtion") {
            var s = "fun[" + o +"]";
        } else {
            return o;
        }
    }
}

exports.StringUtils = StringUtils;
exports.BooleanUtils = BooleanUtils;
exports.JsonUtils = JsonUtils;
exports.CollectionUtils = CollectionUtils;
exports.NullUtils = NullUtils;
exports.NumberUtils = NumberUtils;
exports.StringUtils = StringUtils;
exports.TextUtils = TextUtils;
exports.DateUtils = DateUtils;
exports.ObjUtils = ObjUtils;