// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.services', 'starter.controllers','starter.filters'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  //app介绍页
  .state('introduce', {
    url: '/introduce',
    templateUrl: 'templates/introduce.html',
    controller: 'IntroduceCtrl'
  })
  //登陆页
  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'LoginCtrl'
  })
  //应用首页 --侧滑菜单
  .state('app', {
    url: '/app',
    templateUrl: 'templates/menu.html',
    controller: 'MineCtrl'
  })
  //应用首页 --侧滑菜单 我的信息
  .state('mine', {
    url: "/mine",
    templateUrl: "templates/mine.html",
    controller:'MineCtrl'
  })
  //修改密码
  .state('update', {
    url: "/update",
    templateUrl: "templates/update-pwd.html",
    controller:'MineCtrl'
  })
  //编辑
  .state('edit', {
    url: "/edit",
    templateUrl: "templates/edit-mine.html",
    controller:'MineCtrl'
  })
  //应用首页 --主屏 tab
  .state('app.tab', {
    url: "/tab",
    views: {
      'menuContent' :{
        templateUrl: "templates/tabs.html",
        controller:'TableCtrl'
      }
    }
  })
  //头条
  .state('app.tab.headlines', {
      url: '/headlines',
      views: {
        'tab-headlines': {
          templateUrl: 'templates/headlines.html',
          controller: 'HeadLinesCtrl'
        }
      }
  })
  //头条详情
  .state('newinfo', {
    url: "/newinfo/:id",
    templateUrl: "templates/newinfo.html",
    controller:'NewInfoCtrl'
  })
  //互动
  .state('app.tab.interaction', {
      url: '/interaction',
      views: {
        'tab-interaction': {
          templateUrl: 'templates/interaction.html',
          controller: 'TableCtrl'
        }
      }
  })
  //say hi 
  .state('publishSay', {
    url: "/publishSay",
    templateUrl: "templates/publish-say.html",
    controller:'SayCtrl'
  })
  //Say Hi ~
  .state('say', {
      url: '/say',
      templateUrl: 'templates/say-hi.html',
      controller: 'SayCtrl'
  })
  //Show me ~
  .state('show-me', {
      url: '/show-me',
      templateUrl: 'templates/show-me.html',
      controller: 'ShowCtrl'
  })
  //话题
  .state('app.tab.subject', {
      url: '/subject',
      views: {
        'tab-subject': {
          templateUrl: 'templates/subject.html',
          controller: 'SubjectCtrl'
        }
      }
  })
  .state('subjectInfo', {
    url: "/subjectInfo/:ID",
    templateUrl: "templates/subject-info.html",
    controller:'SubjectCtrl'
  })
  //say hi type：1 ，show me type：2 
  .state('info', {
    url: "/info/:type/:ID",
    templateUrl: "templates/info.html",
    controller:'InfoCtrl'
  })
  //活动
  .state('app.tab.activity', {
      url: '/activity',
      views: {
        'tab-hp': {
          templateUrl: 'templates/activity-hp.html',
          controller: 'ActivityCtrl'
        }
      }
  })
   //活动详情
  .state('activityInfo', {
    url: "/activityInfo/:ID",
    templateUrl: "templates/activity-info.html",
    controller:'ActivityCtrl'
  })
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/introduce');
});
