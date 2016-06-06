/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';
angular.module('starter.loaninspection.controllers', ['starter.loaninspection.services'])

    .controller('LoaninspectionEditController', ['$scope', '$state', '$filter', 'LoanInSpectionService', 'UserInteractiveService', 'DefaultCaptureParameter', 'LoanCheckDataService', 'SynchronizationMappingKeyWordConstant', '$cordovaCapture', '$ionicHistory', '$cordovaFileOpener2', 'SystemInfoSettingService',
        function ($scope, $state, $filter, LoanInSpectionService, UserInteractiveService, DefaultCaptureParameter, LoanCheckDataService, SynchronizationMappingKeyWordConstant, $cordovaCapture, $ionicHistory, $cordovaFileOpener2, SystemInfoSettingService) {

            $scope.isAutoTemporary = false;

            $scope.loanCheckReportInfo = {};
            $scope.captureParameter = DefaultCaptureParameter;

            $scope.$on('$ionicView.beforeEnter', function (e) {

                $scope.isAutoTemporary = SystemInfoSettingService.getSystemInfoSetting().isAutoTemporary;
                
                if ($scope.isAutoTemporary) {
                    $scope.loanCheckReportInfo = $state.params.loanCheckReport;
                } else {
                    $scope.loanCheckReportInfo = angular.extend({}, $state.params.loanCheckReport);
                }

                if ($scope.loanCheckReportInfo) {

                    $scope.loanCheckReportInfo.check_dt = $filter('date')(new Date().getTime(), "yyyyMMdd");

                    var captureParameter = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.PARAMETER_INFO)

                    if (captureParameter && captureParameter.length > 0) {
                        $scope.captureParameter = angular.extend({}, DefaultCaptureParameter, captureParameter[0]);
                    }

                    if (null == $scope.loanCheckReportInfo.pictureType) {
                        $scope.loanCheckReportInfo.pictureType = [];
                    }

                    if (null == $scope.loanCheckReportInfo.videoType) {
                        $scope.loanCheckReportInfo.videoType = [];
                    }

                    if (null == $scope.loanCheckReportInfo.audioType) {
                        $scope.loanCheckReportInfo.audioType = [];
                    }
                }

            });

            $scope.save = function () {

                UserInteractiveService.loading.show("正在保存报告信息");

                $scope.loanCheckReportInfo.report_status = 2;

                LoanInSpectionService.saveLoanCheckReport($scope.loanCheckReportInfo)
                    .then(function () {
                        UserInteractiveService.loading.hide();
                        UserInteractiveService.toast("保存报告信息成功");
                        $ionicHistory.goBack();
                    }, function () {
                        UserInteractiveService.loading.hide();
                        UserInteractiveService.toast("保存报告信息失败");
                    })
            };

            $scope.temporary = function () {

                LoanInSpectionService.temporaryLoanCheckReport($scope.loanCheckReportInfo);

                UserInteractiveService.toast("暂存报告信息成功");

            };

            //AUDIO,IMAGE,VIDEO
            $scope.addCapture = function (type) {

                if (type == 'AUDIO') {
                    var options = {limit: 1, duration: $scope.captureParameter.audioType_time_checkrpt || 60};

                    document.addEventListener("deviceready", function (e) {
                        $cordovaCapture.captureAudio(options).then(function (audioData) {
                            $scope.loanCheckReportInfo.audioType.push(audioData[0]);
                        }, function (err) {
                            UserInteractiveService.toast("加载录音设备失败");
                        });
                    }, false);


                } else if (type == 'IMAGE') {
                    var options = {limit: 1};
                    document.addEventListener("deviceready", function (e) {
                        $cordovaCapture.captureImage(options).then(function (imageData) {
                            $scope.loanCheckReportInfo.pictureType.push(imageData[0]);
                        }, function (err) {
                            UserInteractiveService.toast("加载拍照设备失败");
                        });
                    }, false);
                } else if (type == 'VIDEO') {
                    var options = {limit: 1, duration: $scope.captureParameter.videoType_time_checkrpt || 60};
                    document.addEventListener("deviceready", function (e) {
                        $cordovaCapture.captureVideo(options).then(function (videoData) {
                            $scope.loanCheckReportInfo.videoType.push(videoData[0]);
                        }, function (err) {
                            UserInteractiveService.toast("加载录像设备失败");
                        });
                    }, false);
                }
            };

            $scope.deleteCapture = function ($event, type, parameter) {

                $event.stopPropagation();

                UserInteractiveService.confirm({template: "你却定要删除此媒体信息么？"})
                    .then(function () {
                        if (type == 'AUDIO') {
                            deleteCaptureFromArray($scope.loanCheckReportInfo.audioType, parameter);
                        } else if (type == 'IMAGE') {
                            deleteCaptureFromArray($scope.loanCheckReportInfo.pictureType, parameter);
                        } else if (type == 'VIDEO') {
                            deleteCaptureFromArray($scope.loanCheckReportInfo.videoType, parameter);
                        }
                    });

            };


            $scope.openMedia = function (type, parameter) {

                var mediaType = parameter.type;

                $cordovaFileOpener2.open(parameter.localURL, mediaType)
                    .then(function () {
                    }, function (err) {
                        UserInteractiveService.toast(JSON.stringify(err));
                    });
            };


            function deleteCaptureFromArray(captures, capture) {

                for (var i = 0, n = captures.length; i < n; i++) {
                    if (captures[i].fullPath == capture.fullPath && captures[i].localURL == capture.localURL) {
                        captures.splice(i, 1);
                    }
                }

            };


        }])


    .controller('LoaninspectionViewController', ['$scope', '$state', '$filter', 'LoanInSpectionService', 'UserInteractiveService', 'DefaultCaptureParameter', 'LoanCheckDataService', 'SynchronizationMappingKeyWordConstant', '$cordovaCapture', '$ionicHistory', '$cordovaFileOpener2',
        function ($scope, $state, $filter, LoanInSpectionService, UserInteractiveService, DefaultCaptureParameter, LoanCheckDataService, SynchronizationMappingKeyWordConstant, $cordovaCapture, $ionicHistory, $cordovaFileOpener2) {

            $scope.loanCheckReportInfo = {};
            $scope.captureParameter = DefaultCaptureParameter;

            $scope.$on('$ionicView.beforeEnter', function (e) {
                $scope.loanCheckReportInfo = angular.extend({}, $state.params.loanCheckReport);

                if ($scope.loanCheckReportInfo) {

                    $scope.loanCheckReportInfo.check_dt = $filter('date')(new Date().getTime(), "yyyyMMdd");

                    var captureParameter = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.PARAMETER_INFO)

                    if (captureParameter && captureParameter.length > 0) {
                        $scope.captureParameter = angular.extend({}, DefaultCaptureParameter, captureParameter[0]);
                    }

                    if (null == $scope.loanCheckReportInfo.pictureType) {
                        $scope.loanCheckReportInfo.pictureType = [];
                    }

                    if (null == $scope.loanCheckReportInfo.videoType) {
                        $scope.loanCheckReportInfo.videoType = [];
                    }

                    if (null == $scope.loanCheckReportInfo.audioType) {
                        $scope.loanCheckReportInfo.audioType = [];
                    }
                }

            });


            $scope.openMedia = function (type, parameter) {

                var mediaType = parameter.type;

                $cordovaFileOpener2.open(parameter.localURL, mediaType)
                    .then(function () {
                    }, function (err) {
                        UserInteractiveService.toast(JSON.stringify(err));
                    });
            };


        }])


    .controller('LoaninspectionViewCustomDetailController', ['$scope', '$state', '$ionicSlideBoxDelegate', 'SynchronizationMappingKeyWordConstant', 'LoanCheckDataService',
        function ($scope, $state, $ionicSlideBoxDelegate, SynchronizationMappingKeyWordConstant, LoanCheckDataService) {

            $scope.tabsFlag = 0;

            $scope.$on('$ionicView.beforeEnter', function (e) {
                $scope.tabsFlag = 0;

                $scope.reportsList = $state.params.loanCheckReport;

                $scope.customerInformation = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.CUSTOMER_INFORMATION);

                $scope.loanInformation = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.LOAN_INFORMATION);

                $scope.customerCreditInformation = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.CUSTOMER_CREDIT_INFORMATION);

                $scope.customerAssetInformation = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.CUSTOMER_ASSET_INFORMATION);

                $scope.customerSecurityInformation = LoanCheckDataService.getLoanCheckInfoItem(SynchronizationMappingKeyWordConstant.CUSTOMER_SECURITY_INFORMATION);

            });

            //手势状态联动-tabs2silde
            $scope.$watch("tabsFlag", function (value) {
                $ionicSlideBoxDelegate.slide(value);
            });

            //手势状态联动-silde2tabs
            $scope.tabsSlideChanged = function (index) {
                $scope.tabsFlag = index;
            };

        }]);
