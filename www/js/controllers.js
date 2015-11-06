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
        $state.go("login",{reload: true});
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
                _USER_IMGPATH = data['IMGPATH'];
                  if(!_USER_IMGPATH){ 
			    	 _USER_IMGPATH =  "img/nouser.jpg";
			   	   } 
                _USER_NAME = data['NAME'];
                _USER_ID = data['USERID'];
                //alert(typeof data['SAYHI'])
                if("false" == data['SAYHI']){
                    $ionicPopup.confirm({
                        title: "提示信息",
                        content: "登陆成功！赶紧跟大家say hi 一下吧！",
                        okText:'立即say hi',
                        cancelText: '下一次吧'
                    }).then(function (res) {
                        if (res) {
                            $state.go("publishSay",{reload: true});//点击立即say hi 跳转到发布say hi页面
                        }else{
                            $state.go("app.tab.headlines",{reload: true});//如果点击下次直接跳到应用首页 
                        };
                    });
                }else{
                    $ionicPopup.alert({
                        title: '提示信息',
                        content: "登陆成功！"
                    }).then(function (res) {
                        $state.go("app.tab.headlines",{reload: true});//如果点击下次直接跳到应用首页 
                    }); 
                }    
            }
         })   
    }
})
//我的信息
.controller('MineCtrl', function($scope,$state,$ionicPopup,Variables,initData,$ionicActionSheet) {
    $scope.pwdInfo= {
        oldpwd:'',
        newpwd:'',
        newpwd2:''
    }
    
    
    $scope.userImg = _USER_IMGPATH;  
   
    //根据ID查询登陆人信息
    initData.loadUserById({
        userid:_USER_ID,
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
                $state.go("login",{reload: true});
            }
        });   
    }
    //去编辑
    $scope.editorFun = function (){
        $state.go("edit",{reload: true});
    }
    //我的信息页面返回
    $scope.comebackFun = function (){
        $state.go("app.tab.headlines",{reload: true}); 
    }
    
    //修改密码
    $scope.updatePwd = function(){
        initData.publishFun({
            url:Variables.serverUrl+"/epm/pwd.action",
            data:{
                userid:_USER_ID,
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
    //用户头像上传
    $scope.upload = function(){
        $ionicActionSheet.show({
            buttons: [ 
                {
                    text: '从相册中选取'
                }
            ],
            cancelText: '取消',
            cancel: function () {
                console.log('CANCELLED');
            },
            buttonClicked: function (index) { 
                getPhotoFromAlbum(1, function (imageURL) { 
                       document.getElementById("test_img").src = imageURL+"?"+Math.random(); 
                       _USER_IMGPATH = imageURL;
                       var IMG_UPLOAD_URL = Variables.serverUrl+"/epmupload/upload.action"; 
                       uploadImage(IMG_UPLOAD_URL, imageURL, _USER_ID,'',function (imgurl) {
                            
                       }); 
                       
                }); 
                return true;
            }
        });
    }
})
//应用首页 tab
.controller('TableCtrl', function($scope,$state) {
    //点击事件
    $scope.clickFun = function (url){
        $state.go(url,{reload: true});
    }  
})
//应用首页 tab 今日头条
.controller('HeadLinesCtrl', function($scope,$state,$ionicLoading,initData,$compile,Variables,$ionicPopup) {
    $ionicLoading.show({
        template: 'Loading...'
    });
    //查询今日头条
    $scope.newsCommentList = [];
    var totalPage = 0;
    initData.loadInfoFun({
        url:Variables.serverUrl+"/epmnew/news.action",
        callBackFun:function (data){
            $scope.newsid = data.NEWSID;
            var str1 = ''; 
            var imgList = data.IMGLIST; 
            /**********Li jIE by 2015-11-04*****************/
            _newAppend('comment-li',data.COMMENT); //新闻评论 
            totalPage = data.TOTALPAGE ;//总页数
            if(totalPage <= 1){ 
		    	$('#div_list').hide(); 
            }
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
        if(!content){
         	$ionicPopup.alert({
                title: '提示信息',
                content: "请填写评论信息！"
            });
            return;
        }
        initData.publishFun({
            url:Variables.serverUrl+"/epmnew/addcom.action",
            data:{
                userid:_USER_ID,
                content:content,
                newsid:$scope.newsid   
            },callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){
                	var map ={};
					map['imgpath'] = _USER_IMGPATH;
					map['name'] = _USER_NAME;
					map['content'] = content;
					
					var list = [];
					list.push(map);
					
					_newAppend('comment-li',list,'0'); //新闻评论
					 
                	document.getElementById("content").value = "";//清空下拉选择框 
                    $scope.loadMore();
                    if(totalPage > 1){
                    	$('#loading_start').show();
				    	$('#loading_end1').hide();
				    	$('#loading_end2').hide();
                    }else{
                    	$('#div_list').hide();  
                    }
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
    //加载更多
    var page = 1;
    $scope.loadMore = function (){
    	//点击切换状态 
    	$('#loading_start').hide();
    	$('#loading_end1').show();
    	$('#loading_end2').show();
        var item = [];
        page++;
        if(page <= totalPage){
        	 initData.loadInfoFun({
	            url:Variables.serverUrl+"/epmnew/listcomment.action?page="+page+"&newsid="+$scope.newsid,
	            callBackFun:function (data){
	                item = data.LIST;  
	                totalPage = data.TOTALPAGE;
	                _newAppend('comment-li',item); 
	                if(page == totalPage){
	                	$('#div_list').hide(); 
	                }else{
	                	$('#loading_start').show();
				    	$('#loading_end1').hide();
				    	$('#loading_end2').hide();
	                } 
	//                $scope.$broadcast('scroll.infiniteScrollComplete'); 
	            }
	        });  
        } 
    }
    
    //判断是否需要加载
    $scope.moreDataCanBeLoaded = function (){
        if(page < totalPage-1){
            return true;
        }else{
            return false;
        }   
    }
})
//应用首页 tab Say Hi ~
.controller('SayCtrl', function($scope,initData,Variables,$ionicPopup,$state,$ionicLoading,$ionicPopover,$http) {
	 $ionicLoading.show({
        template: 'Loading...'
    }); 
     // .fromTemplateUrl() 方法
      $ionicPopover.fromTemplateUrl('my-popover.html', {
        scope: $scope
      }).then(function(popover) {
        $scope.popover = popover;
      });
      //返回
      $scope.callBack = function (url){
        $state.go(url)
      }
      $scope.openPopover = function($event) {
        $scope.popover.show($event);
      };
      $scope.closePopover = function() {
        $scope.popover.hide();
      };
      // 清除浮动框
      $scope.$on('$destroy', function() {
        $scope.popover.remove();
      });
      // 在隐藏浮动框后执行
      $scope.$on('popover.hidden', function() {
        // 执行代码
      });
      // 移除浮动框后执行
      $scope.$on('popover.removed', function() {
        // 执行代码
      });
      
      
      //编辑sayhI
      $scope.sayHi = function(){ 
      		$scope.popover.hide();
       		$state.go("publishSay",{reload: true});
      }
      
      //刷新sayhI
      $scope.refreshMySayHi = function(){
       		 $scope.popover.hide();
       		 //调用刷新接口
       		 $http({
		          url:Variables.serverUrl+"/sayhi/sayhirefresh.action?userid="+_USER_ID+"",
		          method:'GET'
		      }).success(function(data,header,config,status){
		          if(data['RESULT_CODE'] == '0'){
		          		initData.loadListFun({
					        url:Variables.serverUrl+'/sayhi/list.action?page=1',
					        callBackFun:function (data){ 
					           $scope.sayList = data;
					           $ionicLoading.hide();
					        }
					    });
		          		$ionicPopup.confirm({
		                  title: "提示信息",
		                  content: "我的Say Hi刷新成功！",
		                  okText:'关闭'
		              }) 
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
      
    //点击确定后
    $scope.submitSay =function (){
       var content = document.getElementById("content_txt").value;
        initData.publishFun({
            url:Variables.serverUrl+"/sayhi/sayhi.action",
            data:{
                userid:_USER_ID,
                content:content
            }
            ,callBackFun:function (data){
                if(data['RESULT_CODE'] == '0'){ 
                  $ionicPopup.alert({
                      title: '提示信息',
                      content: "say hi 成功！"
                  }).then(function (res) {
                  	  document.getElementById("content_txt").value = "";
                      $state.go("app.tab.say",{reload: true}); 
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
            $ionicLoading.hide();
        }
    });
})
//应用首页 tab Show me ~
.controller('ShowCtrl', function($scope,$state,$ionicModal,initData,Variables,$ionicPopup,$ionicLoading) {
	 $ionicLoading.show({
        template: 'Loading...'
    });
    //查询show list 
    initData.loadListFun({
        url:Variables.serverUrl+'/showme/list.action?page=1',
        callBackFun:function (data){ 
           $scope.showList = data;
           $ionicLoading.hide();
        }
    });
    //返回
    $scope.callBack = function (url){
        $state.go(url)
    }
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
.controller('SubjectCtrl', function($scope,initData,Variables,$stateParams,$ionicPopup,$compile,$ionicLoading) {
	 $ionicLoading.show({
        template: 'Loading...'
    });
  //查询每日话题 
    initData.loadListFun({
        url:Variables.serverUrl+'/epmday/list.action',
        callBackFun:function (data){ 
           $scope.subJectList = data;
            $ionicLoading.hide();
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
                if(imgList.length>0){
                    $scope.imgPath = imgList[0].imgpath;//详情页面小图片取图片列表的第一张
                }else{
                   $scope.imgPath = './img/nothing.jpg' 
                } 
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
                userid:_USER_ID,
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
.controller('InfoCtrl', function($scope,$stateParams,initData,Variables,$ionicPopup,$ionicLoading) {
	 $ionicLoading.show({
        template: 'Loading...'
    });
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
           $ionicLoading.hide();
        }
    })
    //评论
    $scope.commentFun = function (){
        var content = document.getElementById("content").value;
        if('1' == type){
            url_sub = Variables.serverUrl+'/sayhi/sayhicommend.action';
            data = {
                sayhiid:id,
                userid:_USER_ID,
                content:content
            }
        }else if('2' == type){
            url_sub = Variables.serverUrl+'/showme/showmecommend.action';
            data = {
                showmeid:id,
                userid:_USER_ID,
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
.controller('ActivityCtrl', function($scope,initData,Variables,$stateParams,$ionicPopup,$compile,$ionicLoading) {
	 $ionicLoading.show({
        template: 'Loading...'
    });
   //查询活动列表
   initData.loadActivityFun({
        callBackFun:function (data){ 
           $scope.activityList = data['ACTIVING'];
           $scope.activedList =data['ACTIVED'];
           $ionicLoading.hide();
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
                if(data['IMGLIST'].length>0){
                    $scope.imgPath = data['IMGLIST'][0].imgpath;//详情页面小图片取图片列表的第一张
                }else{
                   $scope.imgPath = './img/nothing.jpg' 
                }   
            }
        })  
   }
   //报名
   $scope.applyFun = function (){
       initData.publishFun({
            url:Variables.serverUrl+"/epmactive/useractive.action",
            data:{
                userid:_USER_ID,
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
                        content: data['RESULT_MSG'],
                        okText:'确定',
                        cancelText: '取消'
                    })
                }
            }
        });
   }
})

