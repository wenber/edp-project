/***************************************************************************
 *
 * Copyright (c) 2014 Baidu.com, Inc. All Rights Reserved
 * $Id$
 *
 **************************************************************************/



/**
 * get-file-metadata.spec.js ~ 2014/02/22 10:49:56
 * @author leeight(liyubei@baidu.com)
 * @version $Revision$
 * @description
 * 测试lib/util/get-file-metadata.js
 **/
var path = require( 'path' );
// var fs = require( 'fs' );

var Project = path.resolve(__dirname, 'data', 'get-file-meta');
var getFileMeta = require( '../lib/util/get-file-metadata' );

describe('get-file-metadata', function() {
    it('html comment', function(){
        var file = path.resolve( Project, '1.html' );
        var config = getFileMeta( file );
        expect( config ).not.toBe( null );
        expect( config.webpath ).toBe( 'hello' );
        expect( config.t ).toBe( true );
        expect( config.f ).toBe( false );
        expect( config.k ).toBe( 10 );
        expect( JSON.stringify( config.a ) ).toBe(
            JSON.stringify( [ 'hello', 'wor"ld', true, false, 10, 0.1 ] ) );
    });

    it('multiline commnet', function(){
        var file = path.resolve( Project, '1.js' );
        var config = getFileMeta( file );
        expect( config ).not.toBe( null );
        expect( config.webpath ).toBe( 'hello2' );
        expect( config.t ).toBe( true );
        expect( config.f ).toBe( false );
        expect( config.k ).toBe( 10 );
        expect( JSON.stringify( config.a ) ).toBe(
            JSON.stringify( [ 'hello', 'wor"ld', true, false, 10, 0.1 ] ) );
    });
    it('shell file comment', function(){
        var file = path.resolve( Project, '1.sh' );
        var config = getFileMeta( file );
        expect( config ).not.toBe( null );
        expect( config.webpath ).toBe( 'hello2' );
        expect( config.t ).toBe( true );
        expect( config.f ).toBe( false );
        expect( config.k ).toBe( 10 );
        expect( JSON.stringify( config.a ) ).toBe(
            JSON.stringify( [ 'hello', 'wor"ld', true, false, 10, 0.1 ] ) );
    });
    it('single line commnet', function(){
        var file = path.resolve( Project, '2.js' );
        var config = getFileMeta( file );
        expect( config ).not.toBe( null );
        expect( config.webpath ).toBe( 'hello2' );
        expect( config.t ).toBe( true );
        expect( config.f ).toBe( false );
        expect( config.k ).toBe( 10 );
        expect( JSON.stringify( config.a ) ).toBe(
            JSON.stringify( [ 'hello', 'wor"ld', true, false, 10, 0.1 ] ) );
    });
});




















/* vim: set ts=4 sw=4 sts=4 tw=100: */
