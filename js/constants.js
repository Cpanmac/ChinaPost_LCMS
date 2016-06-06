/**
 * Created by Z.JM on 2016/4/18.
 */
'use strict';
angular.module('starter.constants', [])

    //是否调试模式
    .constant("ISDebugConstant", true)

    //假数据路径
    .constant("DemoJSONPathConstant", "json")

    //检查目录
    .constant("CheckDirectoryConstant", {
        "ROOT": "loancheckapp"
    })

    //检查文件名称
    .constant("CheckFileConstant", {
        "DATA": "data.json"
    })

    //同步信息对应关键字
    .constant("SynchronizationMappingKeyWordConstant", {
        "REPORTS_LIST": "检查报告列表",
        "CUSTOMER_INFORMATION": "客户基本信息",
        "LOAN_INFORMATION": "贷款信息",
        "CUSTOMER_CREDIT_INFORMATION": "客户额度信息",
        "CUSTOMER_ASSET_INFORMATION": "客户资产信息",
        "CUSTOMER_SECURITY_INFORMATION": "客户抵质押物信息",
        "USER_INFORMATION": "用户信息",
        "PARAMETER_INFO": "参数信息"
    })

    .constant("DefaultCaptureParameter", {
        "videoType_time_checkrpt": 60,
        "audioType_num_checkrpt": 2,
        "audioType_time_checkrpt": 60,
        "videoType_num_checkrpt": 2,
        "pictureType_num_checkrpt": 2
    })

    .constant("DefaultSystemSettingParameter", {
        "isAutoTemporary": true
    })

    .constant("SystemWebStoreKeyConstant", {
        "SYSTEM_SETTING": "SYSTEM_SETTING",
        "USERINFO_SETTING": "USERINFO_SETTING"
    });
