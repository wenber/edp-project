/**
 * @file 从内容中读取loader配置信息
 * @author errorrik[errorrik@gmail.com]
 */
var edp = require( 'edp-core' );

/**
 * 从内容中读取loader配置信息
 * 
 * @param {string} content 内容.
 * @param {string} file 文件路径.
 * @return {Object|undefined}
 */
module.exports = function ( content, file ) {
    var outputInfo = {};
    var index = content.search( /(require\.config\(\s*\{)/ );
    if ( index < 0 ) {
        return;
    }

    // 取文件内容
    outputInfo.content = content;

    // 取缩进层级
    var whitespace = 0;
    var startIndex = index;

    //得到本行的起始位置信息
    while ( content[ startIndex ] !== '\n' && startIndex > 0 ) {
        startIndex--;
    }

    //检查本行是否含有注释符号，有则说明当前的是注释，不需要替换
    if ( content[ startIndex ] === '\n' || startIndex === 0 ) {
        var beforeRequireCon = content.slice( startIndex + 1, index );
        //有5种注释开头：<!--, //, /*, *, #
        if ( /\s*(<!--|\/\/|\/\*|\*|#)/.test( beforeRequireCon ) ) {
            return;
        }
    }

    //重新回到原来的位置
    startIndex = index;

    while ( content[ --startIndex ] === ' ' ) {
        whitespace++;
    }
    outputInfo.indentBase = Math.floor(whitespace / 4);

    index += RegExp.$1.length - 1;

    // 查找loader config串的开始和结束位置
    var len = content.length;
    var braceLevel = 0;
    outputInfo.fromIndex = index;
    do {
        switch ( content[ index ] ) {
            case '{': 
                braceLevel++;
                break;
            case '}':
                braceLevel--;
                break;
        }

        index++;
    } while ( braceLevel && index < len );
    outputInfo.toIndex = index;

    // 取配置数据
    content = content.slice( outputInfo.fromIndex, index );
    try {
        outputInfo.data = eval( '(' + content + ')' );
    } catch(ex) {
        edp.log.fatal('Invalid require.config content @%s', file);
        return;
    }

    return outputInfo;
};
