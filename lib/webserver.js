/**
 * 获取项目webserver配置文件
 * 
 * @param {string} projectDir 项目目录
 * @return {string} 
 */
exports.getWebserverConfFile = function ( projectDir ) {
    return path.resolve( 
        projectDir, 
        require( './webserver' ).getConfFileName()
    );
};

/**
 * 创建webserver配置文件
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.createWebserverConfFile = function ( projectInfo ) {
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