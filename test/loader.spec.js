/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * loader.spec.js ~ 2014/02/22 10:22:52
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 * lib/loader.js的测试用例
 **/
var fs = require( 'fs' );
var path = require( 'path' );

var Project = path.resolve(__dirname, 'data', 'dummy-project');
var Loader = require( '../lib/loader' );
var ReadLoaderConfig = require( '../lib/util/read-loader-config' );

describe('loader', function() {
    it('getConfig default', function(){
        var file = path.resolve( Project, 'index.html' );
        var config = Loader.getConfig( file );
        expect( config ).not.toBe( null );
        expect( config.url ).toBe( 'http://s1.bdstatic.com/r/www/cache/ecom/esl/1-6-6/esl.js' );
        expect( config.baseUrl ).toBe( 'src' );
        expect( config.packages ).not.toBe( null );
        expect( config.paths ).not.toBe( null );
        expect( config.paths.hello ).toBe( 'bar/hello' );
        expect( config.paths.css ).toBe( 'resource/css' );
        expect( config.packages.length ).toBe( 10 );
        expect( config.packages[0].location ).toBe( '//www.baidu.com/src/remote' );
        expect( config.packages[0].main).toBe( undefined );
    });

    it('getConfig with fileMeta', function(){
        // 读取的并不是文件中的require.config的内容，而是module.conf的内容
        var file = path.resolve( Project, 'src', 'foo.html' );
        var config = Loader.getConfig( file );
        expect( config ).not.toBe( null );
        expect( config.url ).toBe( 'http://s1.bdstatic.com/r/www/cache/ecom/esl/1-6-6/esl.js' );
        expect( config.baseUrl ).toBe( 'edp-project/test/src' );
        expect( config.packages ).not.toBe( null );
        expect( config.paths ).not.toBe( null );
        expect( config.paths.hello ).toBe( 'bar/hello' );
        expect( config.paths.css ).toBe( 'resource/css' );
        expect( config.packages.length ).toBe( 10 );
    });

    it('mergePackages default', function(){
        var oldPackages = [];
        var newPackages = [];

        Loader.mergePackages( oldPackages, newPackages );
        expect( oldPackages.length ).toBe( 0 );

        Loader.mergePackages( oldPackages, [
            {
                'name': 'hello',
                'location': '../dep/hello/0.0.1/src'
            }
        ], 'dummy.js' );
        expect( oldPackages.length ).toBe( 1 );
        expect( oldPackages[0].name ).toBe( 'hello' );
        expect( oldPackages[0].location ).toBe( '../dep/hello/0.0.1/src' );
        expect( oldPackages[0].main ).toBe( undefined );

        Loader.mergePackages( oldPackages, [
            {
                'name': 'hello',
                'location': '../dep/hello/0.0.2/src',
                'main': 'main'
            }
        ], 'dummy.js' );
        expect( oldPackages.length ).toBe( 1 );
        expect( oldPackages[0].name ).toBe( 'hello' );
        expect( oldPackages[0].location ).toBe( '../dep/hello/0.0.2/src' );
        expect( oldPackages[0].main ).toBe( 'main' );
    });

    it( 'updateAllFilesConfig', function(){
        var Project = path.resolve( __dirname, 'data', 'loader', '1' );
        var projectInfo = {
            infoDir: path.resolve( Project, '.edpproj' ),
            dir: Project
        };
        var Map = {};
        spyOn( fs, 'writeFileSync' ).andCallFake( function( file, data, encoding ){
          Map[ path.relative( __dirname, file ) ] = data;
        });
        Loader.updateAllFilesConfig( projectInfo );

        expect( Map[ 'data/loader/1/src/1.html' ] ).not.toBeUndefined();
        expect( Map[ 'data/loader/1/src/2.html' ] ).not.toBeUndefined();

        function getConfig( f ) {
            var c = Map[ f ] || fs.readFileSync( f, 'utf-8' );
            return ReadLoaderConfig( c, f );
        }

        var c1 = getConfig( 'data/loader/1/src/1.html' );
        var c2 = getConfig( 'data/loader/1/src/2.html' );
        expect( c1 ).not.toBeUndefined();
        expect( c1.data ).not.toBeUndefined();
        expect( c2 ).not.toBeUndefined();
        expect( c2.data ).not.toBeUndefined();
        expect( c1.data.baseUrl ).toBe( '../src' );
        expect( c2.data.baseUrl ).toBe( 'http://我/是/不/会/变/的' );
        expect( c1.data.packages.length ).toBe( 5 );
        expect( c2.data.packages.length ).toBe( 5 );

        // loaderAutoConfig 设置为false，不会修改当前文件的require.config的内容
        var c3 = getConfig( 'data/loader/1/src/3.html' );
        expect( c3 ).not.toBeUndefined();
        expect( c3.data ).not.toBeUndefined();
        expect( c3.data.baseUrl ).toBe( 'http://我/是/不/会/变/的' );
        expect( c3.data.packages.length ).toBe( 0 );
    });
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
