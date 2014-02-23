/***************************************************************************
 * 
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$ 
 * 
 **************************************************************************/
 
 
 
/**
 * read-loader-config.spec.js ~ 2014/02/22 14:01:07
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$ 
 * @description 
 *  
 **/
var path = require( 'path' );
var fs = require( 'fs' );

var Project = path.resolve(__dirname, 'data', 'dummy-project');
var ReadLoaderConfig = require( '../lib/util/read-loader-config' );

describe("read-loader-config", function(){
    it("default", function(){
        var file = path.resolve( Project, 'index.html' );
        var content = fs.readFileSync( file, 'utf-8' );

        var config = ReadLoaderConfig( content, file );
        expect( config ).not.toBe( undefined );
        expect( config.content ).toBe( content );
        expect( config.data ).not.toBe( undefined );
        expect( config.indentBase ).toBe( 1 );
        expect( config.fromIndex ).toBeGreaterThan( 0 );
        expect( config.toIndex ).toBeGreaterThan( config.fromIndex );
        expect( config.data.baseUrl ).toBe( 'src' );
        expect( config.data.paths.hello ).toBe( 'src/bar/hello' );
        expect( config.data.packages.length ).toBeGreaterThan( 0 );
    });
});





















/* vim: set ts=4 sw=4 sts=4 tw=100: */
