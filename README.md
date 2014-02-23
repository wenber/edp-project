# edp-package

[![Build Status](https://travis-ci.org/ecomfe/edp-project.png?branch=master)](https://travis-ci.org/ecomfe/edp-project) [![Dependencies Status](https://david-dm.org/ecomfe/edp-project.png)](https://david-dm.org/ecomfe/edp-project)

Package for edp project manage.

## Usage

```javascript
var edpProject = require( 'edp-project' );
edpProject.init( '/home/myname/workspace/myproject' );
```

## Methods


### getInfo( dir )

获取项目信息.

- `dir` {string=}


### init( dir )

将目录初始化为项目目录.

- `dir` {string=}


## Objects


### build

项目build管理功能.


#### createConfigFile( projectInfo )

创建build配置文件.

- `projectInfo` {Info}


### dir

项目目录管理功能.


#### create( name, projectInfo )

在项目中创建目录.

- `name` {string}
- `projectInfo` {Info}


#### init( projectInfo )

初始化项目目录结构.

- `projectInfo` {Info}



### loader

项目loader管理功能.


#### getConfig( file )

获取文件的loader配置信息.

- `file` {string}


#### updateAllFilesConfig( projectInfo )

更新项目所有文件的loader配置信息.

- `projectInfo` {Info}


### metadata

项目metadata信息管理功能.


#### get( projectInfo )

获取项目的metadata信息.

- `projectInfo` {Info}


#### set( projectInfo, data )

获取项目的metadata信息.

- `projectInfo` {Info}
- `data` {JSON}


#### create( projectInfo )

创建项目的metadata文件.

- `projectInfo` {Info}



### module

项目module管理功能.


#### getConfig( projectInfo )

获取项目module配置.

- `projectInfo` {Info}


#### getConfigFile( projectInfo )

获取项目module配置文件.

- `projectInfo` {Info}


#### updateConfig( projectInfo )

创建或者更新module配置文件.

- `projectInfo` {Info}



### webserver

项目webserver管理功能.


#### createConfigFile( projectInfo )

创建webserver配置文件.

- `projectInfo` {Info}
