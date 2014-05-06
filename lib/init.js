/**
 * @file 项目初始化功能
 * @author errorrik[errorrik@gmail.com]
 */

var getInfo = require( './get-info' );
var PROJECT_INFO_DIR = '.edpproj';

/**
 * 将目录初始化为项目目录
 * 
 * @param {string=} dir 目录路径
 * @return {Info} 项目信息对象
 */
module.exports = exports = function ( dir ) {
    dir = dir || process.cwd();

    var projectInfo = getInfo( dir );
    if ( projectInfo ) {
        throw new Error( 'Project is already inited in ' + projectInfo.dir );
    }

    var path = require( 'path' );
    var infoDir = path.resolve( dir, PROJECT_INFO_DIR );
    require( 'mkdirp' ).sync( infoDir );
    projectInfo = getInfo( dir );

    require( './metadata' ).create( projectInfo );
    require( './module' ).updateConfig( projectInfo );

    return projectInfo;
};
