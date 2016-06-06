/**
 * Created by Z.JM on 2016/4/18.
 */
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
'use strict';
angular.module('starter.loaninspection', ['starter.loaninspection.controllers'])

    .config(function ($stateProvider) {
        $stateProvider

            .state('menu.editLoaninspection', {
                url: '/editLoaninspection',
                params: {
                    loanCheckReport: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'modules/loaninspection/templates/editLoaninspection.html',
                        controller: 'LoaninspectionEditController'
                    }
                }
            })

            .state('menu.viewLoaninspection', {
                url: '/viewLoaninspection',
                params: {
                    loanCheckReport: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'modules/loaninspection/templates/viewLoaninspection.html',
                        controller: 'LoaninspectionViewController'
                    }
                }
            })

            .state('menu.viewCustomDetail', {
                url: '/viewCustomDetail',
                params: {
                    loanCheckReport: null
                },
                views: {
                    'menuContent': {
                        templateUrl: 'modules/loaninspection/templates/viewCustomDetail.html',
                        controller: 'LoaninspectionViewCustomDetailController'
                    }
                }
            });
    });
