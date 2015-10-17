// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

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
  .state('app.mine', {
    url: "/mine",
    views: {
      'menuContent' :{
        templateUrl: "templates/mine.html",
        controller:'MineCtrl'
      }
    }
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
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/introduce');
});
