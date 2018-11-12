const path = require('path');
const webpack = require('webpack');
const utils = require('./utils')
const entry = require('./lib');
process.env.NODE_ENV = 'production';

module.exports = {
    entry,
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
          'Vue': 'vue/dist/vue.runtime.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            // {
            //     test: /\.fs$/,
            //     loader: 'babel-loader',
            //     exclude: /node_modules/
            // },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                  limit: 10000,
                  name: utils.assetsPath('img/[name].[ext]')
                }
            },
            {
            test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
            loader: 'url-loader',
            query: {
                limit: 10000,
                name: utils.assetsPath('fonts/[name].[hash:5].[ext]')
            }
            }
        ]
    },
    externals: {
        vue: {
          global: 'Vue', //外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。
          root: 'Vue',//如果库运行在Node.js环境中
          commonjs: 'vue',//如果运行在Node.js环境中
          commonjs2: 'vue',//如果运行在Node.js环境中
          amd: 'vue' //如果使用require.js等加载
        },
        'js-xlsx':{
            global: 'js-xlsx', //外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。
            root: 'js-xlsx',//如果库运行在Node.js环境中
            commonjs: 'js-xlsx',//如果运行在Node.js环境中
            commonjs2: 'js-xlsx',//如果运行在Node.js环境中
            amd: 'js-xlsx' //如果使用require.js等加载
        },
        'xlsx':{
            global: 'xlsx', //外部 library 能够作为全局变量使用。用户可以通过在 script 标签中引入来实现。
            root: 'xlsx',//如果库运行在Node.js环境中
            commonjs: 'xlsx',//如果运行在Node.js环境中
            commonjs2: 'xlsx',//如果运行在Node.js环境中
            amd: 'xlsx' //如果使用require.js等加载
        }                
    },
    output: {
        path: path.resolve(__dirname, '../dist/lib'),
        publicPath: '/dist/lib/',
        filename: '[name].js',
        library: 'h_ui/libs',//requre时候的模块名称
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ]
};
