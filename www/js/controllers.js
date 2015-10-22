angular.module('starter.controllers', [])
//app 介绍
.controller('IntroduceCtrl', function($scope,$state) {
    $scope.toLoginFun = function (){
        //点击立即体验按钮后往本地库插入一条数据，用于判断下次是否还需要进去介绍页面
        $state.go("login");
    }
})
//登陆
.controller('LoginCtrl', function($scope,$state,$ionicPopup) {
    $scope.loginFun = function (){
       //提示登陆成功后 有两个按钮 立即say hi ，下次吧 
       var confirmPopup = $ionicPopup.confirm({
            title: "提示信息",
            content: "登陆成功！赶紧跟大家say hi 一下吧！",
            okText:'立即say hi',
            cancelText: '下一次吧'
        }).then(function (res) {
            if (res) {
                $state.go("publishSay");//点击立即say hi 跳转到发布say hi页面
            }else{
                $state.go("app.tab.headlines");//如果点击下次直接跳到应用首页 
            };
            confirmPopup.close();
        });   
    }
})
//我的信息
.controller('MineCtrl', function($scope,$state,$ionicPopup) {
    $scope.loginOut = function (){
      var confirmPopup = $ionicPopup.confirm({
            title: "提示信息",
            content: "确定退出登陆？",
            okText:'确定',
            cancelText: '取消'
        }).then(function (res) {
            if (res) {
                $state.go("login");
            }
            confirmPopup.close();
        });   
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
.controller('SayCtrl', function($scope,$state,$ionicPopup) {
    //点击确定 后
    $scope.submitSay =function (){
        $ionicPopup.alert({
            title: '提示信息',
            content: "say hi 成功！"
        }).then(function (res) {
            $state.go("app.tab.say"); 
        });  
    } 
})
//应用首页 tab Show me ~
.controller('ShowCtrl', function($scope,$ionicModal) {
    //发布show
    $ionicModal.fromTemplateUrl('templates/publish.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //发布自己的show
    $scope.showFun = function (){
        $scope.modal.show();
    }
    //关闭发布框
    $scope.closeFun = function (){
         $scope.modal.hide();
    }
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

