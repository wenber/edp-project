/**
 * @file 判断url是否相对路径
 * @author errorrik[errorrik@gmail.com]
 */


/**
 * 判断url是否相对路径
 *
 * @param {string} url 路径
 * @return {boolean}
 */
module.exports = function ( url ) {
    return !/^([a-z]{2,10}:\/)?\//i.test( url );
};
