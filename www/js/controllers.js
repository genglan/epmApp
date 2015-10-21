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
       $state.go("app.tab.headlines"); 
    }
})
//我的信息
.controller('MineCtrl', function($scope,$state) {
    $scope.loginOut = function (){
      alert("退出登录");
      $state.go("login");
    }
    //我的信息页面返回
    $scope.comebackFun = function (){
        $state.go("app.tab.headlines"); 
    }
})
//应用首页 tab
.controller('TableCtrl', function($scope,$state) {
    
})
//应用首页 tab 今日头条
.controller('HeadLinesCtrl', function($scope,$state) {
    
})
//应用首页 tab Say Hi ~
.controller('SayCtrl', function($scope,$state) {
    
})
//应用首页 tab Show me ~
.controller('ShowCtrl', function($scope,$state) {
    
})
//应用首页 tab 每日话题
.controller('SubjectCtrl', function($scope,$state) {
    
})
//say hi type：1 ，show me type：2 ，每日话题详情页 type：3
.controller('InfoCtrl', function($scope,$state,$stateParams) {
    var type = $stateParams.type;
    var id = $stateParams.ID;
    $scope.title = type == "1" ?'Say Hi':type == "2" ?'Show me':type == "3" ?'每日话题':'';
})
//应用首页 tab Hp活动
.controller('ActivityCtrl', function($scope,$state) {
    
})

