

var _USER_IMGPATH = '';
var _USER_NAME ='';
var _USER_ID = '';

/**
 * 今日头条评论列表
 */
var _newAppend = function(id,list,type){
	
	if(list && list.length > 0){
		var _html = '';
		for(_index  in list){
			_html += '<div class="list">';
			_html += '<a class="item item-thumbnail-left" href="#">';
			var imgpath = list[_index]['imgpath'];
			if(!imgpath){
				imgpath = 'img/nouser.jpg';
			}
			_html += '<img src="'+imgpath+'">';
			_html += '<h2 class="content-title">'+list[_index]['name']+'</h2>';
			_html += '<p>'+list[_index]['content']+'</p>';
			_html += '</a>';
			_html += '</div>'; 
		}
		
		var _source = document.getElementById(id).innerHTML;
		if('0' == type){
			document.getElementById(id).innerHTML = _html + _source;
		}else{
			document.getElementById(id).innerHTML = _source + _html;
		} 
	}else{
		document.getElementById(id).innerHTML = '';
	} 		
}

/**
 * 清空html列表
 */
var _clear = function(){

}