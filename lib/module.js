/**
 * @file 项目module管理功能
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );
var path = require( 'path' );

/**
 * 项目module配置文件名称
 * 
 * @const
 * @inner
 * @type {string}
 */
var CONFIG_FILE = 'module.conf';

/**
 * 获取项目module配置文件
 * 
 * @param {Info} projectInfo 项目信息对象
 * @return {string} 
 */
exports.getConfigFile = function ( projectInfo ) {
    if ( !projectInfo ) {
        return null;
    }

    return path.resolve( projectInfo.dir, CONFIG_FILE );
};

/**
 * 获取项目module配置
 * 
 * @param {Info} projectInfo 项目信息对象
 * @return {Objecg} 
 */
exports.getConfig = function ( projectInfo ) {
    var file = exports.getConfigFile( projectInfo );

    if ( file && fs.existsSync( file ) ) {
        return JSON.parse( fs.readFileSync( file, 'UTF-8' ) );
    }

    return null;
};

/**
 * 创建或者更新module配置文件
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.updateConfig = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    var projectDir = projectInfo.dir;
    var confFile = exports.getConfigFile( projectInfo );
    var metadata = require( './metadata' ).get( projectInfo );
    var conf = exports.getConfig( projectInfo ) || {};

    conf.baseUrl = metadata.srcDir;
    conf.paths = conf.paths || {};
    conf.packages = [];

    // TODO: package的多版本并存处理
    var packages = require( 'edp-package' ).getImported( projectInfo.dir );
    for ( var key in packages ) {
        var pkg = packages[ key ];
        var ver = Object.keys( pkg ).sort( require( 'semver' ).rcompare )[ 0 ];
        var pkgDir = 'dep/' + key + '/' + ver;

        // 读取package.json
        var pkgJsonFile = path.resolve( projectDir, pkgDir, 'package.json' );
        if ( !fs.existsSync( pkgJsonFile ) ) {
            continue;
        }

        // 检测package的location。
        // 开源社区的包很多都不包含src目录，所以，模块配置信息的location需要监测。
        // 优先规则：
        // 1. ${packageDirectory}/dist
        // 2. ${packageDirectory}/output
        // 3. ${packageDirectory}/src
        // 4. ${packageDirectory}
        var pkgLocation = pkgDir;
        var tryPackageDirs = [ 'dist', 'output', 'src' ];
        for ( var i = 0; i < tryPackageDirs.length; i++ ) {
            var tryPackageDir = tryPackageDirs[ i ];

            if ( 
                fs.existsSync( 
                    path.resolve( 
                        projectDir, 
                        pkgDir, 
                        tryPackageDir 
                    ) 
                )
            ) {
                pkgLocation += '/' + tryPackageDir;
            }
        }

        // package配置初始化
        var pkgConfig = {
            name: key,
            location: pkgLocation
        };

        // 根据package.json中的main，建立当前package的main配置
        var pkgInfo = JSON.parse( fs.readFileSync( pkgJsonFile, 'UTF-8' ) );
        if ( pkgInfo.main ) {
            var main = pkgInfo.main;
            if ( main.indexOf( './src/' ) === 0 ) {
                main = main.substr( 6 );
            }
            if ( main ) {
                pkgConfig.main = main;
            }
        }

        conf.packages.push( pkgConfig );
    }

    // 将配置写入文件
    fs.writeFileSync( confFile, JSON.stringify( conf, null, 4 ), 'UTF-8' );
};

