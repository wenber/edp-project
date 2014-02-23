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
var path = require( 'path' );

var Project = path.resolve(__dirname, 'data', 'dummy-project');
var Loader = require( '../lib/loader' );

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
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
