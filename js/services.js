/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';
angular.module('starter.services', [])

    .factory("WebStorageService", [function () {


        function setLocalStorage(key, storage) {

            if (window.localStorage) {
                window.localStorage.setItem(key, JSON.stringify(storage));
            }

        }

        function getLocalStorage(key) {
            if (window.localStorage) {
                var localStorageString = window.localStorage.getItem(key);

                if (localStorageString) {
                    try {
                        return JSON.parse(localStorageString);
                    } catch (e) {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }

        function removeLocalStorage(key) {
            var storage = null;
            if (window.localStorage) {
                storage = getLocalStorage(key);
                window.localStorage.removeItem(key);
            }
            return storage;
        }


        function setSessionStorage(key, storage) {
            if (window.sessionStorage) {
                window.sessionStorage.setItem(key, JSON.stringify(storage));
            }
        }

        function getSessionStorage(key) {

            if (window.sessionStorage) {
                var localStorageString = window.sessionStorage.getItem(key);
                if (localStorageString) {
                    try {
                        return JSON.parse(localStorageString);
                    } catch (e) {
                        return null;
                    }
                } else {
                    return null;
                }
            } else {
                return null;
            }
        }



        function removeSessionStorage(key) {

            var storage = null;
            if (window.sessionStorage) {

                storage = getSessionStorage(key);
                window.sessionStorage.removeItem(key);
            }
            return storage;

        }

        return {
            setLocalStorage: setLocalStorage,
            getLocalStorage: getLocalStorage,
            removeLocalStorage: removeLocalStorage,
            setSessionStorage: setSessionStorage,
            getSessionStorage: getSessionStorage,
            removeSessionStorage: removeSessionStorage

        };

    }])

    .factory("SystemInfoSettingService", ['$rootScope', 'SystemWebStoreKeyConstant', 'WebStorageService', 'DefaultSystemSettingParameter',
        function ($rootScope, SystemWebStoreKeyConstant, WebStorageService, DefaultSystemSettingParameter) {

            var systemInfoSetting = {};

            return {
                getSystemInfoSetting: function () {
                    systemInfoSetting = WebStorageService.getLocalStorage(SystemWebStoreKeyConstant.SYSTEM_SETTING)

                    systemInfoSetting = angular.extend({}, DefaultSystemSettingParameter, systemInfoSetting);

                    $rootScope.systemInfoSetting = systemInfoSetting;

                    return systemInfoSetting;
                },
                setSystemInfoSetting: function (_systemInfoSetting) {

                    systemInfoSetting = angular.extend({}, DefaultSystemSettingParameter, _systemInfoSetting);

                    $rootScope.systemInfoSetting = systemInfoSetting;

                    WebStorageService.setLocalStorage(SystemWebStoreKeyConstant.SYSTEM_SETTING, systemInfoSetting);
                }
            };

        }])

    .factory("UserInteractiveService", ['$cordovaToast', '$ionicPopup', '$ionicLoading', '$q',
        function ($cordovaToast, $ionicPopup, $ionicLoading, $q) {


            function toast(message) {
                try {
                    return $cordovaToast.show(message, "short", "center");
                } catch (e) {
                    return ionicPopupAlert({template: message});
                }
            }

            function ionicPopupAlert(parameters) {

                var option = {
                    title: "提示信息",
                    template: "",
                    okText: '知道了',
                    okType: 'button-chinapost'
                };

                option = angular.extend({}, option, parameters);

                return $ionicPopup.alert(option);
            }

            function ionicLoadingShow(message) {
                var loadingConfig = {
                    duration: 60000,
                    template: '<ion-spinner class="spinner-panda"></ion-spinner><div class="text-center"><span>' + message || '正在加载' + '</span></div>'
                };

                return $ionicLoading.show(loadingConfig);
            }

            function ionicLoadingHide() {
                $ionicLoading.hide();
            }

            function confirmPopup(parameters) {

                var deferred = $q.defer();

                var option = {
                    title: '确认提醒',
                    template: '您确定此操作么？',
                    cancelText: '取消',
                    cancelType: 'button-chinapost button-outline',
                    okText: '确定',
                    okType: 'button-chinapost'
                };

                option = angular.extend({}, option, parameters);

                $ionicPopup.confirm(option)
                    .then(function (res) {
                        if (res) {
                            deferred.resolve();
                        } else {
                            deferred.reject();
                        }
                    });

                return deferred.promise;

            }

            return {
                toast: toast,
                alert: ionicPopupAlert,
                loading: {
                    show: ionicLoadingShow,
                    hide: ionicLoadingHide
                },
                confirm: confirmPopup
            }

        }])

    .factory("UserInfoService", ['SystemWebStoreKeyConstant', 'WebStorageService',
        function (SystemWebStoreKeyConstant, WebStorageService) {

            var userInfo = null;

            return {
                getUserInfo: function () {
                    return userInfo;
                },
                setUserInfo: function (_userInfo) {


                    var localUserInfo = WebStorageService.getLocalStorage(SystemWebStoreKeyConstant.USERINFO_SETTING + "_" + _userInfo.user_cd);

                    userInfo = angular.extend({}, localUserInfo, _userInfo);

                    if (userInfo) {
                        WebStorageService.setLocalStorage(SystemWebStoreKeyConstant.USERINFO_SETTING + "_" + userInfo.user_cd, userInfo);
                    }

                }
            };

        }])

    .factory("LoanCheckDataService", [function () {

        var loanCheckInfo = [];

        return {
            getLoanCheckInfo: function () {
                return loanCheckInfo;
            },
            setLoanCheckInfo: function (_loanCheckInfo) {
                loanCheckInfo = _loanCheckInfo;
            },
            getLoanCheckInfoItem: function (itemName) {

                var resultItem = null;

                angular.forEach(loanCheckInfo, function (item) {
                    if (item.tableName == itemName) {
                        resultItem = item.rows;
                    }
                });

                return resultItem;

            }

        };

    }])

    .factory("SynchronizationDataService", ['$q', 'CheckDirectoryConstant', 'CheckFileConstant', '$cordovaFile', 'ISDebugConstant', 'DemoJSONPathConstant', '$http',
        function ($q, CheckDirectoryConstant, CheckFileConstant, $cordovaFile, ISDebugConstant, DemoJSONPathConstant, $http) {

            var externalRootDirectory = null;

            //获取开放根目录
            function getExternalRootDirectory() {
                if (!externalRootDirectory) {
                    if (ISDebugConstant) {
                        externalRootDirectory = DemoJSONPathConstant;
                    } else {
                        externalRootDirectory = cordova.file.externalRootDirectory;
                    }
                }
                return externalRootDirectory;
            }

            function readLoanCheckInfo(username) {
                var deferred = $q.defer();

                if (ISDebugConstant) {

                    $http.post(getExternalRootDirectory() + "/" + CheckDirectoryConstant.ROOT + "/" + username + "/" + CheckFileConstant.DATA)
                        .success(function (success) {
                            deferred.resolve(success);
                        })
                        .error(function (error) {
                            deferred.reject(error);
                        });

                } else {
                    document.addEventListener('deviceready', function () {
                        $cordovaFile.readAsText(getExternalRootDirectory() + "/" + CheckDirectoryConstant.ROOT + "/" + username, CheckFileConstant.DATA)
                            .then(function (success) {
                                try {
                                    deferred.resolve(JSON.parse(success));
                                } catch (e) {
                                    deferred.reject(e);
                                }
                            }, function (error) {
                                deferred.reject(error);
                            });
                    });
                }

                return deferred.promise;

            }

            function writeLoanCheckInfo(username, data) {
                var deferred = $q.defer();

                if (ISDebugConstant) {
                    deferred.resolve();
                } else {
                    document.addEventListener('deviceready', function () {
                        $cordovaFile.writeFile(getExternalRootDirectory() + "/" + CheckDirectoryConstant.ROOT + "/" + username, CheckFileConstant.DATA, JSON.stringify(data), true)
                            .then(function (success) {
                                deferred.resolve(success);
                            }, function (error) {
                                deferred.reject(error);
                            });
                    });
                }

                return deferred.promise;

            }

            return {
                getExternalRootDirectory: getExternalRootDirectory,
                readLoanCheckInfo: readLoanCheckInfo,
                writeLoanCheckInfo: writeLoanCheckInfo
            };

        }]);