/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';
angular.module('starter.loaninspection.services', [])

    .factory("LoanInSpectionService", ['SynchronizationDataService', 'UserInfoService', 'LoanCheckDataService', 'SynchronizationMappingKeyWordConstant',
        function (SynchronizationDataService, UserInfoService, LoanCheckDataService, SynchronizationMappingKeyWordConstant) {

            function saveLoanCheckReport(loanCheckReport) {

                var userInfo = UserInfoService.getUserInfo();

                return SynchronizationDataService.writeLoanCheckInfo(userInfo.user_name, temporaryLoanCheckReport(loanCheckReport));

            }

            function temporaryLoanCheckReport(loanCheckReport) {

                var loanCheckData = LoanCheckDataService.getLoanCheckInfo();

                if (loanCheckData) {
                    for (var i = 0, n = loanCheckData.length; i < n; i++) {
                        if (SynchronizationMappingKeyWordConstant.REPORTS_LIST == loanCheckData[i].tableName) {
                            if (loanCheckData[i].rows && loanCheckData[i].rows.length > 0) {
                                for (var j = 0, m = loanCheckData[i].rows.length; j < m; j++) {
                                    if (loanCheckData[i].rows[j].report_id == loanCheckReport.report_id) {
                                        loanCheckData[i].rows[j] = loanCheckReport;
                                    }
                                }
                            }
                        }
                    }
                }

                return loanCheckData;
            }


            return {
                saveLoanCheckReport: saveLoanCheckReport,
                temporaryLoanCheckReport: temporaryLoanCheckReport
            };


        }]);