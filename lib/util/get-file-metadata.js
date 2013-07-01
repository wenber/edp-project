/**
 * @file 读取文件声明的edp元数据信息
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 读取文件声明的edp元数据信息
 * 元数据信息使用JSON格式声明，但不支持JSON null，number不支持`e`。
 * 注意：JSON字符串必须以双引号开头。
 * 
 * @param {string} file 文件路径
 * @param {string=} encoding 编码方式
 * @return {JSON} 
 */
module.exports = function ( file, encoding ) {
    var fs = require( 'fs' );
    if ( !fs.existsSync( file ) ) {
        throw new Error( file + ' is not exists!');
    }

    var START_TEXT = 'edp:';

    // 读取文件内容
    encoding = encoding || 'UTF-8';
    var lines = fs.readFileSync( file, encoding ).split( /\r?\n/ );
    var currentLine = 0;
    function nextLine() {
        if ( currentLine >= lines.length ) {
            return null;
        }

        return lines[ currentLine++ ];
    }

    // 读取注释中的metadata内容
    var isReadContentStart = 0;
    var content = [];
    while ( ( line = nextLine() ) != null ) {
        if ( isReadContentStart ) {
            if ( lineReplacer.test( line ) ) {
                content.push( line.replace( lineReplacer, '' ) );
            }
            else {
                break;
            }
        }
        else if ( 
            /^\s*(<!--|\/\/|\/\*|#)/.test( line ) 
            && line.indexOf( START_TEXT ) > 0 
        ) {
            isReadContentStart = 1;
            content.push( 
                line.slice( line.indexOf( START_TEXT ) + START_TEXT.length ) 
            );

            // 支持4种形式的注释识别
            var lineReplacer = {
                '<!--' : /^\s*/,
                '/*'   : /^\s*\**\s*/,
                '#'    : /^\s*#\s*/,
                '\/\/' : /^\s*\/\/\s*/
            }[ RegExp.$1 ];
        }
    }

    // 解析注释中的metadata内容
    content = content.join( '' );
    var len = content.length;
    var currentChar = 0;

    /**
     * 读取光标前移，返回当前字符
     * 
     * @inner
     * @return {string} 
     */
    function nextChar() {
        if ( currentChar >= len ) {
            return null;
        }

        return content[ currentChar++ ];
    }

    /**
     * 读取当前字符
     * 
     * @inner
     * @return {string} 
     */
    function currChar() {
        if ( currentChar >= len ) {
            return null;
        }

        return content[ currentChar ];
    }

    /**
     * 忽略空白字符，读取下一个期望遇见的有效字符
     * 
     * @inner
     * @param {string|RegExp} what 期望遇见的字符
     * @return {boolean} 
     */
    function meet( what ) {
        var c;
        while ( ( c = currChar() ) != null ) {
            if ( !/\s/.test( c ) ) {
                if ( what instanceof RegExp ) {
                    return what.test( c );
                }

                return what === c;
            }

            nextChar();
        }

        return false;
    }

    /**
     * 读取字符串
     * 
     * @inner
     */
    function readString() {
        nextChar();
        var c;
        while ( ( c = currChar() ) != null ) {
            switch ( c ) {
                case '\\':
                    nextChar();
                    break;
                case '"':
                    nextChar();
                    return;
            }

            nextChar();
        }
    }

    /**
     * 读取数字
     * 
     * @inner
     */
    function readNumber() {
        nextChar();
        var c;
        while ( ( c = currChar() ) != null ) {
            if ( !/[0-9.]/.test( c ) ) {
                return;
            }

            nextChar();
        }
    }

    /**
     * 读取bool值
     * 
     * @inner
     */
    function readBoolean() {
        if ( /^(true|false)/.test( content.slice( currentChar ) ) ) {
            currentChar += RegExp.$1.length;
        }
        else {
            throw new Error( '[EDP file metadata] Expect true/false' );
        }
    }

    /**
     * 读取数组
     * 
     * @inner
     */
    function readArray() {
        nextChar();
        while ( !meet( ']' ) ) {
            readAny();
        }

        nextChar();
    }

    /**
     * 读取对象
     * 
     * @inner
     */
    function readObject() {
        nextChar();
        while ( !meet( '}' ) ) {
            if ( meet( '"' ) ) {
                readString();
                meet( ':' );
                nextChar();
                readAny();
            }
            else if ( meet( ',' ) ) {
                nextChar();
            }
            else {
                throw new Error( '[EDP file metadata] name expect string' );
            }
        }

        nextChar();
    }

    /**
     * 读取任意类型
     * 
     * @inner
     */
    function readAny() {
        var readers = [
            { what: '"', method: readString },
            { what: /[-+0-9.]/, method: readNumber },
            { what: '{', method: readObject },
            { what: '[', method: readArray },
            { what: /[tf]/, method: readBoolean }
        ];

        for ( var i = 0; i < readers.length; i++ ){
            if ( meet( readers[ i ].what ) ) {
                readers[ i ].method();
                break;
            }
        }

        return i < readers.length;
    }

    if ( !readAny() ) {
        throw new Error( '[EDP file metadata] invalid format' );
    }
    
    return JSON.parse( content.slice( 0, currentChar ) );
};
