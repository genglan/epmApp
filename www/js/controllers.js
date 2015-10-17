angular.module('starter.controllers', [])
//app 介绍
.controller('IntroduceCtrl', function($scope,$state) {
    $scope.toLoginFun = function (){
        //点击立即体验按钮后往本地库插入一条数据，用于判断下次是否还需要进去介绍页面
        $state.go("login");
    }
})
//登陆
.controller('LoginCtrl', function($scope,$state) {
    $scope.loginFun = function (){
       $state.go("app.tab"); 
    }
})
//我的信息
.controller('MineCtrl', function($scope,$state) {
    $scope.loginOut = function (){
      alert("退出登录");
      $state.go("login");
    }
})
//应用首页 table
.controller('TableCtrl', function($scope,$state) {
    
})
