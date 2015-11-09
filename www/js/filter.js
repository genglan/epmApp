angular.module('starter.filters', [])
.filter('indexOfFilter',function (){//替换
	var indexOfStr = function(data,arg){
		if('1' == arg){
			return data.substring(0,1)+"**";
		}
        if('4' == arg){//电话
        	return data.substring(0,7)+"****";
        }
	}
	return indexOfStr;
})
.filter('dateFilter',function (){//日期
	var dateStr = function(data){
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1 ;
		var day =  date.getDate();
		month = month<9?'0'+month:month;
		day = day<=9?'0'+day:day;
		var today = year+"-"+month+"-"+day ;
		//alert(today +"------"+data)
		if(data.substring(0,10) == today){
			return '今天 '+data.substring(10)
		}else{
			return data
		}
	}
	return dateStr;
})


