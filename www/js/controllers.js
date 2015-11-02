angular.module('starter.controllers', [])
//app 介绍
.controller('IntroduceCtrl', function($scope,$state,$http,$ionicLoading,initData,Variables) {
    $ionicLoading.show({
        template: 'Loading...'
    });
    initData.loadListFun({
        url:Variables.serverUrl+'/epm/epmsys.action',
        callBackFun:function (data){ 
            setTimeout(function() {  
                $scope.$apply(function() {  
                    $scope.introduceList = data;
                    $ionicLoading.hide();
                });  
             }, 1000);
        }
    });
    //进入
    $scope.toLoginFun = function (){
        $state.go("login");
    }
})
//登陆
.controller('LoginCtrl', function($scope,$state,$ionicPopup,Variables,$rootScope,initData) {
    $scope.user = {
        'account': "admin",
        'pwd': "123456"
    }
    $scope.loginFun = function (){
        //点击立即体验按钮后往本地库插入一条数据，用于判断下次是否还需要进去介绍页面
         initData.loadInfoFun({
            url:Variables.serverUrl+"/epm/login.action?account="+$scope.user.account+"&password="+$scope.user.pwd+"",
            callBackFun:function (data){
                window.localStorage.setItem("USERID",data['USERID']);
                $rootScope.name = data['NAME'];
                //alert(typeof data['SAYHI'])
                if("false" == data['SAYHI']){
                    $ionicPopup.confirm({
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
                    });
                }else{
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "登陆成功！"
                    }).then(function (res) {
                        $state.go("app.tab.headlines");//如果点击下次直接跳到应用首页 
                    }); 
                }    
            }
         })   
    }
})
//我的信息
.controller('MineCtrl', function($scope,$state,$ionicPopup,Variables,initData) {
    $scope.pwdInfo= {
        oldpwd:'',
        newpwd:'',
        newpwd2:''
    }
    //根据ID查询登陆人信息
    initData.loadUserById({
        userid:window.localStorage.USERID,
        callBackFun:function (data){
            $scope.user = data;
        }
    });
    //退出登录
    $scope.loginOut = function (){
        $ionicPopup.confirm({
            title: "提示信息",
            content: "确定退出登陆？",
            okText:'确定',
            cancelText: '取消'
        }).then(function (res) {
            if (res) {
                $state.go("login");
            }
        });   
    }
    //去编辑
    $scope.editorFun = function (){
        $state.go("edit");
    }
    //我的信息页面返回
    $scope.comebackFun = function (){
        $state.go("app.tab.headlines"); 
    }
    
    //修改密码
    $scope.updatePwd = function(){
        initData.publishFun({
            url:Variables.serverUrl+"/epm/pwd.action",
            data:{
                userid:window.localStorage.USERID,
                oldpwd:$scope.pwdInfo.oldpwd,
                newpwd:$scope.pwdInfo.newpwd
            },
            callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "密码修改成功！"
                    }) 
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "密码修改异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }
        });
    }
    //修改个人信息
    $scope.updateUser = function(){
        initData.publishFun({
            url:Variables.serverUrl+"/epm/update.action",
            data:{
                userid:$scope.user.USERID,
                name:$scope.user.NAME,
                school:$scope.user.SCHOOL,
                profess:$scope.user.PROFESS,
                classg:$scope.user.CLASSG,
                sex:$scope.user.SEX,
                mobile:$scope.user.MOBILE 
            },
            callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "个人信息修改成功！"
                    }) 
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "个人信息修改异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }
        });
    }
})
//应用首页 tab
.controller('TableCtrl', function($scope,$state) {
    
})
//应用首页 tab 今日头条
.controller('HeadLinesCtrl', function($scope,$state,$ionicLoading,initData,$compile,Variables,$ionicPopup) {
    $ionicLoading.show({
        template: 'Loading...'
    });
    //查询今日头条
    initData.loadInfoFun({
        url:Variables.serverUrl+"/epmnew/news.action",
        callBackFun:function (data){
            $scope.newsid = data.NEWSID;
            $scope.newsCommentList = data.COMMENT;
            var str1 = ''; 
            var imgList = data.IMGLIST;
            if(imgList.length>0){
                for(var i =0 ;i <imgList.length ;i++ ){
                    str1 +='<ion-slide><div class="box"><img src="'+imgList[i].filepath+'" /></div></ion-slide>';
                }
            }
            var str =  '<li class="content-title">'+data.TITLE+'</li>'+
                       '<li class="li-span">'+
                            '<span>'+data.CREATETIME+'</span>'+
                            '<span>'+data.DEPTNAME+'</span>'+
                        '</li>'+
                        '<li class="img-word-li">'+
                          '<ion-slide-box>'+str1+'</ion-slide-box>'+
                        '</li>'+
                        '<li class="paragraph-li">'+
                            '<span>'+data.CONTENT+'</span>'+
                        '</li>';
            var htmlStr = $compile(str)($scope);
            var el = document.getElementById("headInfo");
            angular.element(el).html('').append(htmlStr);
            $ionicLoading.hide();
        }
    });
    //发布评论
    $scope.subCommnet = function(){
        var content = document.getElementById("content").value;
        initData.publishFun({
            url:Variables.serverUrl+"/epmnew/addcom.action",
            data:{
                userid:window.localStorage.USERID,
                content:content,
                newsid:$scope.newsid   
            },callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "评论成功！"
                    });
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "评论异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }
            
        });
    }  
})
//应用首页 tab Say Hi ~
.controller('SayCtrl', function($scope,initData,Variables,$ionicPopup,$state) {
    //点击确定后
    $scope.submitSay =function (){
       var content = document.getElementById("content").value;
        initData.publishFun({
            url:Variables.serverUrl+"/sayhi/sayhi.action",
            data:{
                userid:window.localStorage.USERID,
                content:content
            }
            ,callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                  $ionicPopup.alert({
                      title: '提示信息',
                      content: "say hi 成功！"
                  }).then(function (res) {
                      $state.go("app.tab.say"); 
                  });  
              }else{
                    $ionicPopup.confirm({
                      title: "提示信息",
                      content: "发布say hi 异常！",
                      okText:'确定',
                      cancelText: '取消'
                    })
                }
            }
        })   
    }
    //查询say list 
    initData.loadListFun({
        url:Variables.serverUrl+'/sayhi/list.action?page=1',
        callBackFun:function (data){ 
           $scope.sayList = data;
        }
    });
})
//应用首页 tab Show me ~
.controller('ShowCtrl', function($scope,$ionicModal,initData,Variables,$ionicPopup) {
    //查询show list 
    initData.loadListFun({
        url:Variables.serverUrl+'/showme/list.action?page=1',
        callBackFun:function (data){ 
           $scope.showList = data;
        }
    });
    //发布show
    $ionicModal.fromTemplateUrl('templates/publish.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.modal = modal;
    });
    //发布自己的show
    $scope.showFun = function (id){
        $scope.modal.show();
        $scope.showmeid = id;
    }
    //关闭发布框
    $scope.closeFun = function (){
         $scope.modal.hide();
    }
    //发布show 
    $scope.publishShow = function (){
        alert("暂无")
    }
})
//应用首页 tab 每日话题
.controller('SubjectCtrl', function($scope,initData,Variables,$stateParams,$ionicPopup,$compile) {
  //查询每日话题 
    initData.loadListFun({
        url:Variables.serverUrl+'/epmday/list.action',
        callBackFun:function (data){ 
           $scope.subJectList = data;
        }
    });
    //查询详情
    var id = $stateParams.ID;
    if(!!id){
        initData.loadInfoFun({
            url:Variables.serverUrl+'/epmday/getday.action?dayid='+id,
            callBackFun:function (data){
                var info = data['LIST'][0];
                var commonList = data['COMMENT'];
                var imgList = data['IMGLIST'];
                $scope.info = info;//详情
                $scope.commonList = commonList;//评论列表
                $scope.imgList = imgList;//图片列表
                $scope.imgPath = imgList[0].imgpath;//详情页面小图片取图片列表的第一张
                var str="<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+$scope.info.content+"</p>"
                var htmlStr = $compile(str)($scope);
                var el = document.getElementById("subjectContent");
                angular.element(el).html('').append(htmlStr);
            }
        })  
    }
    //评论
    $scope.subCommont = function (){
        var content = document.getElementById("content").value;
        initData.publishFun({
            url:Variables.serverUrl+'/epmday/addcom.action',
            data:{
                dayid:$scope.info.id,
                userid:window.localStorage.USERID,
                content:content
            },
            callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "评论成功！"
                    });
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "评论异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }    
            
        });
    }
})
//say hi type：1 ，show me type：2 
.controller('InfoCtrl', function($scope,$stateParams,initData,Variables,$ionicPopup) {
    var type = $stateParams.type;
    var id = $stateParams.ID;
    $scope.title = type == "1" ?'Say Hi':type == "2" ?'Show me':type == "3" ?'每日话题':'';
    var url_info = "",url_sub = "";
    var data = {};
    if('1' == type){
        url_info = Variables.serverUrl+'/sayhi/getsayhi.action?sayhiid='+id;
    }else if('2' == type){
        url_info = Variables.serverUrl+'/showme/getshowme.action?showmeid='+id;
    }
    //查询评论
    initData.loadInfoFun({
        url:url_info,
        callBackFun:function (data){
           var info = data['LIST'][0];
           var commonList = data['COMMENT'];
           $scope.info = info;
           $scope.commonList = commonList;
        }
    })
    //评论
    $scope.commentFun = function (){
        var content = document.getElementById("content").value;
        if('1' == type){
            url_sub = Variables.serverUrl+'/sayhi/sayhicommend.action';
            data = {
                sayhiid:id,
                userid:window.localStorage.USERID,
                content:content
            }
        }else if('2' == type){
            url_sub = Variables.serverUrl+'/showme/showmecommend.action';
            data = {
                showmeid:id,
                userid:window.localStorage.USERID,
                content:content
            }
        }
        initData.publishFun({
            url:url_sub,
            data:data,
            callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "评论成功！"
                    });
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "评论异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }    
            
        });
    }
})
//应用首页 tab Hp活动
.controller('ActivityCtrl', function($scope,initData,Variables,$stateParams,$ionicPopup,$compile) {
   //查询活动列表
   initData.loadActivityFun({
        callBackFun:function (data){ 
           $scope.activityList = data['ACTIVING'];
           $scope.activedList =data['ACTIVED'];
        }
    });  
   var id = $stateParams.ID;  
   if(!!id){
        initData.loadInfoFun({
            url:Variables.serverUrl+'/epmactive/getactive.action?activeid='+id,
            callBackFun:function (data){
                $scope.activityInfo = data["LIST"][0];
                var str="<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+$scope.activityInfo.content+"</p>"
                var htmlStr = $compile(str)($scope);
                var el = document.getElementById("avtivityContent");
                angular.element(el).html('').append(htmlStr);
                $scope.imgList = data['IMGLIST'];//活动相关图片
                $scope.userList = data['USERLIST'];//已报名名单
                $scope.imgPath = data['IMGLIST'][0].imgpath;//详情页面小图片取图片列表的第一张
            }
        })  
   }
   //报名
   $scope.applyFun = function (){
       initData.publishFun({
            url:Variables.serverUrl+"/epmactive/useractive.action",
            data:{
                userid:window.localStorage.USERID,
                activeid:id
            },
            callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "报名成功！"
                    }) 
                }else{
                   $ionicPopup.confirm({
                        title: "提示信息",
                        content: "报名异常！",
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }
        });
   }
})

