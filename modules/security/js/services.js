/**
 * Created by Z.JM on 2016/4/18.
 */

angular.module('starter.security.services', [])

    .factory("SecurityLoginService", ['$q', 'SynchronizationDataService', 'SynchronizationMappingKeyWordConstant',
        function ($q, SynchronizationDataService, SynchronizationMappingKeyWordConstant) {

            //登录操作
            return function (userAccount) {

                var deferred = $q.defer();

                SynchronizationDataService.readLoanCheckInfo(userAccount.userName)
                    .then(function (result) {

                        angular.forEach(result, function (item) {

                            if (item.tableName == SynchronizationMappingKeyWordConstant.USER_INFORMATION) {
                                if (true) {
                                    deferred.resolve({userInfo: item.rows[0], loanCheckInfo: result});
                                }
                            }
                        });

                        deferred.reject("用户名或密码错误");

                    }, function (error) {
                        deferred.reject(error);
                    });

                return deferred.promise;

            }

        }]);
