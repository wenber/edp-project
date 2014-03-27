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

    //根据文件类型(html, less)来判断我们采用何种方式引入css或者是less,或者其他的
    var isHtml = /\.html$/.test( file );
    // <link rel="stylesheet" href="dep/esui/3.1.0-alpha.5/src/css/main.css">
    // @import "../../../dep/esui/3.1.0-alpha.5/src/css/main.less";
    var regPattern = isHtml
        ? /<link.+href=(["']?)([^'">]+)\1[^>]*\/>/ig
        : /import\s+(['"]?)([^'";]+)\1;/ig;

    //用来判定本文件内容是否发生改变, 来决定最后的文件是否要重写
    var isChanged = false;

    var fileContent = fs.readFileSync( file, encoding ).replace(
        regPattern,
        /**
         * 用在依赖的最新的CSS module来更新文件中的CSS或者Less
         * @inner
         * @param {string=} match 整个匹配的link或者import
         * @param {string=} boundary Reg.$1, 匹配的是"‘"或者是'"'
         * @param {string=} url Reg.$2, 匹配的是实际的引用的url
         */
        function ( match, boundary, url ) {
            var sep = '/'; //url分割符
            var targetDir = 'dep';

            boundary = boundary ? boundary : '"';

            //来判定是否是html style
            var isHtmlStyle = true;

            if ( isHtml && !( /rel\s*=\s*(["']?)stylesheet\1/i ).test( match ) ) {
                isHtmlStyle = false;
            }


            //判断是否含有目标目录，如果没有，则不必执行下面的操作
            if ( isHtmlStyle && url && url.search( targetDir + sep ) >= 0 ) {
                var segs = url.split( sep );

                var targetIndex = segs.indexOf( targetDir );

                if ( targetIndex >= 0 ) {
                    //如果发现dep目录，则获取当前module的版本信息, dep/esui/3.1.0-alpha.5/
                    var moduleVersion = segs[ targetIndex + 2 ];

                    if ( semver.valid( moduleVersion ) ) {
                        var pkgName = segs[ targetIndex + 1 ];
                        var pkg = packages[ pkgName ] || {};
                        var vers = Object.keys( pkg );

                        //如果存在多个版本的情况下，取版本号最大的，即是最新的
                        if ( vers.length > 0 ) {
                            segs[ targetIndex + 2 ] = vers.sort( semver.rcompare )[ 0 ];

                            var tpl = isHtml
                                ? '<link rel="stylesheet" href=%s%s%s/>'
                                : 'import %s%s%s;';

                            isChanged = true;
                            return require( 'util' ).format( tpl, boundary, segs.join( sep ), boundary );
                        }
                    }
                }

            }

            return match;
        }
    );

    if ( isChanged ) {
        fs.writeFileSync( file, fileContent, encoding );
    }
}

