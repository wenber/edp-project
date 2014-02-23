/**
 * @file 项目style管理功能
 * @author errorrik[errorrik@gmail.com]
 */

var fs = require( 'fs' );
var semver = require( 'semver' );

var edp = require( 'edp-core' );

var packages;

/**
 * 更新对package的样式import
 * 主要有两部分：
 * 1. less文件中的@import url("")
 * 3. html文件中的<link rel="stylesheet" href="dep/esui/3.1.0-alpha.5/src/css/main.css">
 *
 *
 * @param {Info} projectInfo 项目信息对象
 */
exports.updatePackageImport = function ( projectInfo ) {
    if ( !projectInfo ) {
        return;
    }

    // read packages
    if ( !packages ) {
        packages = require( 'edp-package' ).getImported( projectInfo.dir );
    }

    scanAndUpdate( projectInfo.dir );
};


/**
 * 扫描目录并更新文件
 * 
 * @inner
 * @param {string} dir 目录名
 * @param {RegExp=} extnameRule 过滤条件
 */
function scanAndUpdate( dir, extnameRule ) {
    var extnameRule = extnameRule || /\.((c|le)ss|html)$/i;

    fs.readdirSync( dir ).forEach( 
        function ( file ) {
            if ( file === 'dep' || file === 'node_modules' || file.indexOf( '.' ) === 0 ) {
                return;
            }

            var fullPath = edp.path.resolve( dir, file );
            var stat = fs.statSync( fullPath );
            if ( stat.isDirectory() ) {
                scanAndUpdate( fullPath, extnameRule );
            }
            else if ( stat.isFile() 
                && extnameRule.test( edp.path.extname( file ) ) 
            ) {
                updateFileImport( fullPath );
            }
        }
    );
}

/**
 * 更新样式文件的import
 * 
 * @inner
 * @param {string} file 文件路径
 * @param {string=} encoding 文件编码，默认utf8
 */
function updateFileImport( file, encoding ) {
    encoding = encoding || 'UTF-8';

    var isHtml = /\.html$/.test( file );
    // <link rel="stylesheet" href="dep/esui/3.1.0-alpha.5/src/css/main.css">
    // @import "../../../dep/esui/3.1.0-alpha.5/src/css/main.less";
    var regPattern = isHtml ? /<link\s+rel=["']stylesheet["']\s+href=(["'])([^'"]+)\1[^>]*>/g : /import\s+(['"])([^'"]+)\1;/g;

    var fileContent = fs.readFileSync( file, encoding ).replace(
        regPattern,
        function ( match, start, url ) {
            var segs = url.split( '/' );
            segLoop: for ( var i = 0, len = segs.length; i < len; i++ ) {
                var seg = segs[ i ];
                switch ( seg ) {
                    case '.':
                    case '..':
                        break;

                    case 'dep':
                        if ( semver.valid( segs[ i + 2 ] ) ) {
                            var pkg = packages[ segs[ i + 1 ] ] || {};
                            var vers = Object.keys( pkg );

                            if ( vers.length > 0 ) {
                                segs[ i + 2 ] = vers.sort( semver.rcompare )[0];
                                var tpl = isHtml ? '<link rel="stylesheet" href=%s%s%s>' : 'import %s%s%s;';
                                return require( 'util' ).format( tpl, start, segs.join( '/' ), start );
                            }
                        }
                        break segLoop;

                    default:
                        break segLoop;
                }
            }

            return match;
        }
    );

    fs.writeFileSync( file, fileContent, encoding );
}

