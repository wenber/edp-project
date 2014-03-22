project updateLoaderConfig
---------

### Usage

    edp project updateLoaderConfig
    
### Description

`updateLoaderConfig`可以根据项目下的`module.conf`文件中的配置，更新项目资源（比如index.html）中的AMD加载器配置`require.config({..})`。

该命令一般不需要手工调用，在项目下使用`edp import`或者`edp update`等package管理的命令时，将自动更新AMD加载器配置。
