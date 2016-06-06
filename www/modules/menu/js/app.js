/**
 * Created by Z.JM on 2016/4/18.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';
angular.module('starter.menu', ['starter.menu.controllers'])

    .config(function ($stateProvider) {
        $stateProvider

            .state('menu', {
                url: '/menu',
                abstract: true,
                templateUrl: 'modules/menu/templates/menu.html',
                controller: 'MenuController'
            })

            .state('menu.message', {
                url: '/message',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/menu/templates/message.html',
                        controller: 'MenuMessageController'
                    }
                }
            })

            .state('menu.setting', {
                url: '/setting',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/menu/templates/setting.html',
                        controller: 'MenuSettingController'
                    }
                }
            })

            .state('menu.loanInspection', {
                url: '/loanInspection',
                views: {
                    'menuContent': {
                        templateUrl: 'modules/menu/templates/loanInspection.html',
                        controller: 'MenuLoanInspectionController'
                    }
                }
            });
    });
