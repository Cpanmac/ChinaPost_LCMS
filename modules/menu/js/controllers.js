/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';

angular.module('starter.menu.controllers', ['starter.menu.services'])

    .controller('MenuController', ['$scope', '$state', '$ionicModal', 'UserInfoService', 'LoanCheckDataService', '$cordovaBarcodeScanner', 'UserInteractiveService', 'SynchronizationMappingKeyWordConstant', '$cordovaFileTransfer', '$timeout', '$cordovaFileOpener2',
        function ($scope, $state, $ionicModal, UserInfoService, LoanCheckDataService, $cordovaBarcodeScanner, UserInteractiveService, SynchronizationMappingKeyWordConstant, $cordovaFileTransfer, $timeout, $cordovaFileOpener2) {

            $scope.userInfo = {};

            $scope.$on('$ionicView.enter', function (e) {

                $scope.userInfo = UserInfoService.getUserInfo();

                $scope.loanCheckReportList = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.REPORTS_LIST);

                $scope.mesageCount = 0;

                angular.forEach($scope.loanCheckReportList, function (loanCheckReport) {
                    if (loanCheckReport.report_status != 2) {
                        $scope.mesageCount++;
                    }
                });

                $scope.download = function () {

                    $scope.downloadProgress = 0;

                    document.addEventListener('deviceready', function () {

                        var url = "http://dl.58cdn.com.cn/productor/2016/v7.0.1.0_batch/58client_v7.0.1.0_3.apk";
                        var targetPath = cordova.file.externalRootDirectory + "58client_v7.0.1.0_3.apk";

                        var trustHosts = true;
                        var options = {};

                        $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
                            .then(function (result) {

                                if (result && result.isFile) {

                                    $scope.downloadProgress = 100;

                                    $cordovaFileOpener2.open(
                                        result.nativeURL,
                                        'application/vnd.android.package-archive'
                                    ).then(function () {
                                        alert("安装成功");
                                    }, function (err) {
                                        alert(JSON.stringify(err));
                                    });
                                }

                            }, function (err) {
                                alert(JSON.stringify(err));
                            }, function (progress) {
                                $timeout(function () {
                                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                                });
                            });

                    }, false);
                }
            });

            $scope.logout = function () {

                LoanCheckDataService.setLoanCheckInfo(null);

                $state.go("login");
            };


            $scope.setBarcode = function () {

                document.addEventListener("deviceready", function () {

                    $cordovaBarcodeScanner
                        .scan()
                        .then(function (barcodeData) {

                            if (!barcodeData.cancelled) {
                                $scope.userInfo.qrCode = barcodeData.text;

                                UserInfoService.setUserInfo($scope.userInfo);

                                UserInteractiveService.toast($scope.userInfo.qrCode);
                            }

                        }, function (error) {
                            UserInteractiveService.toast("识别二维码错误,请重新再试");
                        });

                }, false);

            };

            $ionicModal.fromTemplateUrl('modules/menu/templates/personInfo.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function (modal) {
                $scope.modal = modal;
            });

            $scope.closePersonInfo = function () {
                $scope.modal.hide();
            };

            $scope.showPersonInfo = function () {
                $scope.modal.show();
            };

            $scope.$on('$destroy', function () {
                $scope.modal.remove();
            });

        }])

    .controller('MenuSettingController', ['$scope', 'SystemInfoSettingService',

        function ($scope, SystemInfoSettingService) {

            $scope.systemInfoSetting = SystemInfoSettingService.getSystemInfoSetting();

            $scope.changeIsAutoTemporary = function () {
                SystemInfoSettingService.setSystemInfoSetting($scope.systemInfoSetting);
            }

        }])

    .controller('MenuMessageController', ['$scope', '$stateParams', 'LoanCheckDataService', 'SynchronizationMappingKeyWordConstant',
        function ($scope, $stateParams, LoanCheckDataService, SynchronizationMappingKeyWordConstant) {

            $scope.$on('$ionicView.enter', function (e) {
                $scope.loanCheckReportList = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.REPORTS_LIST);

                $scope.labels = ["已生成未检查", "已检查未提交"];
                $scope.data = [0, 0];
                $scope.colours = ['#FF0033', '#CCFF33'];

                angular.forEach($scope.loanCheckReportList, function (loanCheckReport) {
                    if (loanCheckReport.report_status == 2) {
                        $scope.data[1]++;
                    } else {
                        $scope.data[0]++;
                    }
                });

            });


        }])

    .controller('MenuLoanInspectionController', ['$scope', '$ionicModal', 'LoanCheckDataService', 'SynchronizationMappingKeyWordConstant',
        function ($scope, $ionicModal, LoanCheckDataService, SynchronizationMappingKeyWordConstant) {

            $scope.loanCheckReportList = [];

            $scope.searchCondition = {};

            $scope.inputSearchCondition = {};

            $scope.$on('$ionicView.beforeEnter', function (e) {
                $scope.searchCondition = {};
                $scope.loanCheckReportList = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.REPORTS_LIST);
            });

            $scope.searchLoanList = function () {
                $scope.searchCondition = angular.extend({}, $scope.inputSearchCondition);
            };

            $ionicModal.fromTemplateUrl('modules/menu/templates/searchLoanListModal.html', {
                scope: $scope,
                animation: 'slide-in-right'
            }).then(function (modal) {
                $scope.searchLoanListModal = modal;
            });

            $scope.closeSearchLoanListModal = function () {
                $scope.searchLoanListModal.hide();
            };

            $scope.showSearchLoanListModal = function () {
                $scope.searchLoanListModal.show();
            };

            $scope.$on('$destroy', function () {
                $scope.searchLoanListModal.remove();
            });

        }]);
