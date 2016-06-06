/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';
angular.module('starter.configs', [])
    .config(['ChartJsProvider', function (ChartJsProvider) {
        ChartJsProvider.setOptions({colours: ['#803690', '#00ADF9', '#DCDCDC', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360']});
    }])
    .config(['$urlRouterProvider', '$ionicConfigProvider',
        function ($urlRouterProvider, $ionicConfigProvider) {

            //配置ionic平台相关参数 主要针对IOS Android
            $ionicConfigProvider.platform.ios.tabs.style('standard');
            $ionicConfigProvider.platform.ios.tabs.position('bottom');
            $ionicConfigProvider.platform.android.tabs.style('standard');
            $ionicConfigProvider.platform.android.tabs.position('standard');

            $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
            $ionicConfigProvider.platform.android.navBar.alignTitle('center');

            $ionicConfigProvider.platform.ios.backButton.previousTitleText('');
            $ionicConfigProvider.platform.android.backButton.previousTitleText('');

            $ionicConfigProvider.platform.ios.views.transition('ios');
            $ionicConfigProvider.platform.android.views.transition('android');

            $ionicConfigProvider.platform.ios.form.checkbox('circle');
            $ionicConfigProvider.platform.android.form.checkbox('square');

            $ionicConfigProvider.platform.ios.spinner.icon('ios');
            $ionicConfigProvider.platform.android.spinner.icon('android');

            //默认路由
            $urlRouterProvider.otherwise('/login');

        }]);