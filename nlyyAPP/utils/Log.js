/**
 * Created by rplees on 13-12-26.
 */
const Log = {
    _l(array) {
        if(!array) return;
        let m = array[0];
        for (var i = 1; i < array.length; i++) {
            if (m.indexOf("%s") > -1) {
                m = m.replace("%s", array[i]);
            } else {
                m = m.replace("{}", array[i]);
            }
        }

        console.log(m);
    },

    log(m){
       this._l(Array.prototype.slice.apply(arguments));
    },

    info(m){
        this._l(Array.prototype.slice.apply(arguments));
    },

    debug(m){
        this._l(Array.prototype.slice.apply(arguments));
    },

    warn(m){
        var arr = Array.prototype.slice.apply(arguments);
        if(arr)
            arr[0] = '[warn]' + arr[0];

        this._l(arr);
    },

    error(m){
        var arr = Array.prototype.slice.apply(arguments);
        if(arr)
            arr[0] = '[error]' + arr[0];
        this._l(arr);
    }
}

module.exports = Log;