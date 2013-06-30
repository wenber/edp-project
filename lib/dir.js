

/**
 * 在项目中创建目录
 * 
 * @param {string} name 目录名称
 * @param {Info} projectInfo 项目信息对象
 */
exports.create = function ( name, projectInfo ) {
    if ( projectInfo ) {
        var dir = path.resolve( projectInfo.dir, name );
        require( 'mkdirp' ).sync( dir );
    }
};


/**
 * 初始化项目目录结构
 * 
 * @param {Info} projectInfo 项目信息对象
 */
exports.initDir = function ( projectInfo ) {
    var createDir = exports.create;

    createDir( 'dep', projectInfo );
    createDir( 'src', projectInfo );
    createDir( 'tool', projectInfo );
    createDir( 'test', projectInfo );
    createDir( 'doc', projectInfo );
};
