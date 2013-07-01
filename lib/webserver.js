/**
 * @file 项目webserver管理功能
 * @author errorrik[errorrik@gmail.com]
 */

/**
 * 创建webserver配置文件
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.createConfigFile = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    var fs = require( 'fs' );
    var path = require( 'path' );

    // TODO: 暂时hardcode，未来需要依赖edp-webserver
    var file = path.resolve( projectInfo.dir, 'edp-webserver-config.js' );
    var tplFile = path.resolve( __dirname, './webserver-config.tpl' );

    if ( !fs.existsSync( file ) ) {
        var buf = fs.readFileSync( tplFile );
        fs.writeFileSync( file, buf );
    }
};
