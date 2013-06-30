

var PROJECT_INFO_DIR = require( './util/get-info-dir' )();

/**
 * 获取项目信息
 * 
 * @param {string=} dir 目录路径
 * @return {string}
 */
module.exports = exports = function ( dir ) {
    dir = dir || process.cwd();
    var fs = require( 'fs' );

    if ( fs.existsSync( dir )
         && fs.statSync( dir ).isDirectory()
    ) {
    
        while ( dir ) {
            // 查找当前目录下是否存在项目info目录
            var infoDir = path.resolve( dir, PROJECT_INFO_DIR );
            if ( fs.existsSync( infoDir ) 
                 && fs.statSync( infoDir ).isDirectory() 
            ) {
                return new Info( dir, infoDir );
            }
            
            // 向上查找目录
            var parentPath = path.resolve( dir, '..' );
            if ( parentPath === dir ) {
                break;
            }
            dir = parentPath;
        }

    }

    return null;
};
