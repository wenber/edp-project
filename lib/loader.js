/**
 * @file 项目loader管理功能
 * @author errorrik[errorrik@gmail.com],
 *         treelite[c.xinle@gmail.com]
 */

var fs = require( 'fs' );
var metadataMod = require( './metadata' );
var path = require( './util/path' );
var isRelativePath = require ('./util/is-relative-path' );


// TODO: package的多版本并存处理


/**
 * 获取文件的loader config信息
 * 
 * @param {string} file 文件路径
 * @return {Object}
 */
exports.getConfig = function ( file ) {
    var dir = path.dirname( file );

    var projInfo = require( './get-info' )( dir );
    if ( !projInfo ) {
        return null;
    }

    // 获取处理所需的相关信息
    var projMetadata = metadataMod.get( projInfo );
    var moduleConf = require( './module' ).getConfig( projInfo );
    if ( !moduleConf || !projMetadata ) {
        return null;
    }


    var baseUrl = moduleConf.baseUrl;
    var wwwroot = projMetadata.wwwroot;
    var fileMetadata = {};
    try {
        fileMetadata = require( './util/get-file-metadata' )( file );
    } 
    catch (ex) {}

    // 计算相对于wwwroot的路径：
    // 1. 文件声明webpath的metadata时，为webpath to wwwroot的路径
    // 2. 文件未声明webpath的metadata时，为filepath to projectDir的路径
    var webpath = fileMetadata.webpath;
    var relativePath = webpath
        ? path.relative( webpath.replace( /\/$/, '/term' ), wwwroot )
            .replace( /^\.\./, '.' )
            .replace( /^\.\//, '' )
        : path.relative( file, projInfo.dir )
            .replace( /^\.\./, '.' )
            .replace( /^\.\/?/, '' );
    relativePath && (relativePath += '/');

    // 初始化信息数据
    var data = {
        url: projMetadata.loaderUrl,
        baseUrl: relativePath + baseUrl,
        paths: {},
        packages: []
    };
    
    // 计算paths配置
    var paths = moduleConf.paths;
    for ( var key in paths ) {
        var pathValue = paths[ key ];
        if ( isRelativePath( pathValue ) ) {
            pathValue = path.relative( '/' + baseUrl, '/' + pathValue );
        }

        data.paths[ key ] = pathValue;
    }

    // 计算packages配置
    moduleConf.packages.forEach( function ( pkg ) {
        var pkgLocation = pkg.location;
        if ( isRelativePath( pkgLocation ) ) {
            pkgLocation = path.relative( '/' + baseUrl, '/' + pkgLocation );
        }

        data.packages.push({
            name: pkg.name,
            location: pkgLocation,
            main: pkg.main
        });
    } );

    return data;
};

/**
 * 更新文件的config
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} encoding 文件编码
 */
function updateFileConfig( file, encoding ) {
    encoding = encoding || 'UTF-8';
    var fileContent = fs.readFileSync( file, encoding );
    var confInfo = require( './util/read-loader-config' )( fileContent );
    
    if ( confInfo ) {
        var content = confInfo.fileContent;

        var projectData = exports.getConfig( file );
        var configData = confInfo.data;

        configData.paths = projectData.paths;
        configData.packages = projectData.packages;
        configData.baseUrl = projectData.baseUrl;

        fs.writeFileSync( 
            file,
            require( './util/replace-loader-config' )( configData, confInfo ),
            encoding 
        );
    }
}

/**
 * 扫描目录并更新文件
 * 
 * @inner
 * @param {string} dir 目录名
 * @param {RegExp} extnameRule 文件扩展名匹配的正则
 */
function scanAndUpdate( dir, extnameRule ) {
    fs.readdirSync( dir ).forEach( 
        function ( file ) {
            if ( file === 'dep' || file.indexOf( '.' ) === 0 ) {
                return;
            }

            var fullPath = path.resolve( dir, file );
            var stat = fs.statSync( fullPath );
            if ( stat.isDirectory() ) {
                scanAndUpdate( fullPath, extnameRule );
            }
            else if ( stat.isFile() 
                && extnameRule.test( path.extname( file ) ) 
            ) {
                updateFileConfig( fullPath );
            }
        }
    );
}

/**
 * 更新loader配置信息
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.updateAllFilesConfig = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    var extnames = ( metadataMod.get( projectInfo ) || {} ).loaderAutoConfig;
    if ( extnames ) {
        scanAndUpdate( 
            projectInfo.dir, 
            new RegExp( '\\.(' + extnames.replace( /,/g, '|' ) + ')$' )
        );
    }
};

