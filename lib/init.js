

var getInfo = require( './get-info' );
var PROJECT_INFO_DIR = require( './util/get-info-dir' )();

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
        throw new Error( 'Project is inited in ' + projectInfo.dir );
    }

    var infoDir = path.resolve( dir, PROJECT_INFO_DIR );
    require( 'mkdirp' ).sync( infoDir );
    projectInfo = getInfo( dir );

    require( './metadata' ).create( projectInfo );
    require( './module' ).updateConfig( projectInfo );

    return projectInfo;
};
