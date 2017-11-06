/* global hexo */ //console.log()
// content:
/*
		[seconds,]
		{ 								//天		   | 时            | 分            | 12小时制        | 24小时制            | 计数
			clockFace: 'DailyCounter',  //DailyCounter | HourlyCounter | MinuteCounter | TwelveHourClock | TwentyFourHourClock | Counter
			showSeconds: false,
			callbacks: {	//回调函数										    
							interval: function() {},		//刷新
							init: 	  function() {},		//初始化						
							start: 	  function() {},		//初始化						
							stop:     function() {},        //停止
							reset:    function() {}         //重置							
					   } 		
		}			
*/
// Usage: {% clock class %} Content {% endclock %}



function createClock(args, content) {	
	args = args.join(' ').split(',');
	var id = (args[0]) || 'clock';
	var height = parseInt(args[1]) || 100;
	var width = parseInt(args[2]) || '100%';	
	//var content = args[1];
	//for (var i=2;i<args.length;i++)
	//{
	//   content = content + ',' + args[i];
	//}		
	
	if (content === '') {		
		content = "{ clockFace: 'DailyCounter' }"
	}

	var html = '<div id="'+id+'" class="customFlipClock" style="height: '+height+';width: '+width+'; ">'+content+'</div>';
									  
	return html;
}	
	
hexo.extend.tag.register('clock', createClock, {ends: true});

/* 
	计时器
	$('#id').FlipClock(seconds, { 
									clockFace: 'DailyCounter',
									countdown: false
								}
					   );
 */

