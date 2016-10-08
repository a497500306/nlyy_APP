
var settings = require("../settings");
module.exports = {
    mlPost(url,json,responseJson){
        fetch(settings.fwqUrl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json; charset=utf-8',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(json)
        })
            .then((response) => response.json())
            .then((responseJson) => {
                alert("zhengque");
                responseJson(responseJson,null,1);
            })
            .catch((error) => {
                alert("shibai");
                responseJson(null,error,1);
            });
    }
}