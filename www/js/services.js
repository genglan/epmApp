angular.module('starter.services', [])
// 公共变量 
.factory("Variables",function (){
    return {
        serverUrl :"http://123.56.41.109:8080/epm-i" 
    }
})
//查询信息
.factory("initData",function (Variables,$http,$ionicPopup,$state){
    //查询列表
    var loadListFun = function(opts){
      $http({
          url:opts.url,
          method:'GET'
      }).success(function(data,header,config,status){
          if(data['RESULT_CODE'] == '0'){
              var list = data['RESULT_JSON']['LIST'];
              opts.callBackFun && opts.callBackFun(list,data['RESULT_JSON']['TOTALPAGE']);  
          }else{
              $ionicPopup.confirm({
                  title: "提示信息",
                  content: "数据查询异常！",
                  okText:'确定',
                  cancelText: '取消'
              })
          }
      }).error(function(data,header,config,status){
          //处理响应失败
          $ionicPopup.confirm({
              title: "提示信息",
              content: "服务器响应失败",
              okText:'确定',
              cancelText: '取消'
          })
      });
    }
    //查询单个对象
    var loadInfoFun = function(opts){
      $http({
            url:opts.url,
            method:'GET'
        }).success(function(data,header,config,status){
            if(data['RESULT_CODE'] == '0'){
               //提示登陆成功后 有两个按钮 立即say hi ，下次吧 
                var json =data['RESULT_JSON'];
                opts.callBackFun && opts.callBackFun(json);  
            }else{
                $ionicPopup.confirm({
                    title: "提示信息",
                    content: "数据查询异常！",
                    okText:'确定',
                    cancelText: '取消'
                })
            }
        }).error(function(data,header,config,status){
            //处理响应失败
            $ionicPopup.confirm({
                title: "提示信息",
                content: "服务器响应失败",
                okText:'确定',
                cancelText: '取消'
            })
        });
    }
    //post 请求
    var publishFun = function (opts){ 
       $.ajax({
          url:opts.url,
          type:'POST',
          data:opts.data
      }).success(function(data,header,config,status){
        opts.callBackFun && opts.callBackFun(data);    
      }).error(function(data,header,config,status){
          //处理响应失败
          $ionicPopup.confirm({
              title: "提示信息",
              content: "服务器响应失败!",
              okText:'确定',
              cancelText: '取消'
          })
      }); 
    }
    //根据用户ID查询用户信息
    var loadUserById = function (opts){
      $http({
          url:Variables.serverUrl+"/epm/getUserById.action?userid="+opts.userid+"",
          method:'GET'
      }).success(function(data,header,config,status){
          if(data['RESULT_CODE'] == '0'){
              var json = data['RESULT_JSON'];
              opts.callBackFun && opts.callBackFun(json); 
          }else{
              $ionicPopup.confirm({
                  title: "提示信息",
                  content: "个人信息查询异常！",
                  okText:'确定',
                  cancelText: '取消'
              })
          }
      }).error(function(data,header,config,status){
          //处理响应失败
          $ionicPopup.confirm({
              title: "提示信息",
              content: "服务器响应失败",
              okText:'确定',
              cancelText: '取消'
          })
      });
    }
    
    //查询活动
    var loadActivityFun =function (opts){
      $http({
      	  url:opts.url, 
          method:'GET'
      }).success(function(data,header,config,status){
          if(data['RESULT_CODE'] == '0'){
              var json = data['RESULT_JSON'];
              opts.callBackFun && opts.callBackFun(json);  
          }else{
              $ionicPopup.confirm({
                  title: "提示信息",
                  content: "数据查询异常！",
                  okText:'确定',
                  cancelText: '取消'
              })
          }
      }).error(function(data,header,config,status){
          //处理响应失败
          $ionicPopup.confirm({
              title: "提示信息",
              content: "服务器响应失败",
              okText:'确定',
              cancelText: '取消'
          })
      });
    }
    //查询活动详情
    var loadActivityInfo = function (opts){

    }
    //报名活动
    var applyActivity = function (opts){

    }
    return {
        loadListFun:function (opts){//查询列表
          return loadListFun(opts);
        },
        loadInfoFun:function (opts){//查询单个对象
          return loadInfoFun(opts);
        },
        publishFun:publishFun,//发布
        loadUserById:function (opts){//根据用户ID查询用户信息
          return loadUserById(opts);
        },
        loadActivityFun:function (opts){//查询活动
          return loadActivityFun(opts);
        },
        loadActivityInfo:function(opts){//查询活动详情
          return loadActivityInfo(opts);
        },
        applyActivity:applyActivity//报名活动
    }
})