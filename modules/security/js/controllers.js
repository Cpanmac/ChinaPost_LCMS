/**
 * Created by Z.JM on 2016/4/18.
 */
angular.module('starter.security.controllers', ['starter.security.services'])

    .controller('SecurityLoginController', ['$scope', '$state', '$filter', 'SecurityLoginService', 'UserInfoService', 'LoanCheckDataService', 'UserInteractiveService', '$timeout',
        function ($scope, $state, $filter, SecurityLoginService, UserInfoService, LoanCheckDataService, UserInteractiveService, $timeout) {

            $scope.$on('$ionicView.afterEnter', function (e) {
                $scope.userAccount = {};
            });

            $scope.login = function () {

                UserInteractiveService.loading.show("正在登录");

                $timeout(function () {
                    SecurityLoginService({
                        userName: $scope.userAccount.userName,
                        password: $filter("uppercase")(CryptoJS.MD5(CryptoJS.MD5($scope.userAccount.password).toString()).toString())
                    }).then(function (result) {

                        UserInteractiveService.loading.hide();

                        UserInfoService.setUserInfo(result.userInfo);
                        LoanCheckDataService.setLoanCheckInfo(result.loanCheckInfo);

                        $state.go("menu.loanInspection", {});

                    }, function (error) {

                        UserInteractiveService.loading.hide();

                        UserInteractiveService.toast("用户名或密码错误");
                    });
                }, 1000);


            };

        }]);
