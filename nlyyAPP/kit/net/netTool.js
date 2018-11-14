var Toast = require('../../node_modules/antd-mobile/lib/toast/index');
exports.post = function(url,params){
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("成功")
                console.log(responseJson.msg)
                if (responseJson.isSucceed == 200){
                    Toast.offline(responseJson.msg, 1.5);
                    reject(error)
                }else{
                    resolve(responseJson)
                }
            })
            .catch((error) => {
                Toast.offline(responseJson.msg, 1.5);
                reject(error)
            });
    })
}