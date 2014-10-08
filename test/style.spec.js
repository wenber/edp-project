/**
 * style.spec.js ~2014/03/12
 * @author moonreplace(daihuiming@baidu.com)
 * @description
 * UT for lib/style.js
 **/

var path = require('path');
var fs = require('fs');

var projectDir = path.resolve(__dirname, 'data', 'style');
var packages = require('edp-package').getImported(projectDir);
var style = require('../lib/style.js');

describe('sytle', function() {

    var beforeVersion = '0.0.1';
    var updatedVersion = Object.keys(packages.esui) [0];
    var htmlFile = path.resolve(projectDir, 'style.html');
    var lessFile = path.resolve(projectDir, 'style.less');

    var beforeHtmlContent;
    var beforeLessContent;

    beforeEach(function () {
        beforeHtmlContent = fs.readFileSync(htmlFile, 'UTF-8');
        beforeLessContent = fs.readFileSync(lessFile, 'UTF-8');
    });

    it('update html', function () {
        expect(beforeHtmlContent.search(updatedVersion)).toBeLessThan(0);
        expect(beforeHtmlContent.search(beforeVersion)).toBeGreaterThan(0);
        style.updatePackageImport({ 'dir' : projectDir });

        var updatedHtmlContent = fs.readFileSync(htmlFile, 'UTF-8');

        expect(updatedHtmlContent.search(beforeVersion)).toBeLessThan(0);
        expect(updatedHtmlContent.match(new RegExp(updatedVersion, 'g')).length).toEqual(4);
    });

    it('update less', function () {
        expect(beforeLessContent.search(updatedVersion)).toBeLessThan(0);
        expect(beforeLessContent.search(beforeVersion)).toBeGreaterThan(0);
        style.updatePackageImport({ 'dir' : projectDir });

        var updatedLessContent = fs.readFileSync(lessFile, 'UTF-8');

        expect(updatedLessContent.search(beforeVersion)).toBeLessThan(0);
        expect(updatedLessContent.search(updatedVersion)).toBeGreaterThan(0);
    });

    afterEach(function() {
        fs.writeFileSync(htmlFile, beforeHtmlContent, 'UTF-8');
        fs.writeFileSync(lessFile, beforeLessContent, 'UTF-8');
    });
});
