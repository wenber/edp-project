/**
 * @file 项目metadata信息管理功能
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );

/**
 * 项目metadata配置文件名
 * 
 * @const
 * @inner
 * @type {string}
 */
var FILE = 'metadata';

/**
 * 项目默认metadata配置
 * 
 * @const
 * @inner
 * @type {Object}
 */
var DEFAULT = {
    wwwroot: '/',
    depDir: 'dep',
    srcDir: 'src',
    loaderAutoConfig: 'js,htm,html,tpl,vm,phtml'
};


/**
 * 默认模块加载器的配置
 * 
 * @const
 * @type {string}
 */
var LOADER_URL = 'http://s1.bdstatic.com/r/www/cache/ecom/esl/1-4-2/esl.js';

/**
 * 获取metadata文件路径
 * 
 * @inner
 * @param {Info} projectInfo 项目信息对象
 * @return {string} 
 */
function getFile( projectInfo ) {
    return require( 'path' ).join( projectInfo.infoDir, FILE );
}

/**
 * 获取项目的metadata信息
 * 
 * @param {Info} projectInfo 项目信息对象
 * @return {Object} 
 */
exports.get = function ( projectInfo ) {
    if ( projectInfo ) {
        return JSON.parse( 
            fs.readFileSync( 
                getFile( projectInfo ),
                'UTF-8' 
            )
        );
    }

    return null;
};

/**
 * 设置项目的metadata信息
 * 
 * @param {Info} projectInfo 项目信息对象
 * @return {Object} 
 */
exports.set = function ( projectInfo, data ) {
    if ( projectInfo ) {
        var file = getFile( projectInfo );
        fs.writeFileSync( 
            file, 
            JSON.stringify( data, null, 4 ),
            'UTF-8'
        );
    }
};

/**
 * 创建项目的metadata文件
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.create = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    var file = getFile( projectInfo );
    if ( !fs.existsSync( file ) ) {
        var data = JSON.parse( JSON.stringify( DEFAULT ) );
        var edpConfig = require( 'edp-config' );

        data.loaderUrl = edpConfig.get( 'loader.url' ) || LOADER_URL;
        exports.set( projectInfo, data );
    }
};

