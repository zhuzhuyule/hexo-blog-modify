function changeClockCSS(cssid){		                                                      
		var baseHeight = $(cssid).css('height');                                          
		var perHeight = parseInt(baseHeight) / 10; 
			
		var widthUl = 	perHeight * 6;
		var widthSpan = perHeight * 2;		
		var widthUlAll = widthUl * ($(cssid ).children('ul').length + 2);
		var widthSpanAll = widthSpan * ($(cssid ).children('span').length + 1);
		var totalWidth = widthUlAll + widthSpanAll;
		
		//console.log(widthUl,$(cssid ).children('ul').length, widthUlAll ,totalWidth);
		//console.log(widthSpan,$(cssid ).children('span').length, widthSpanAll ,totalWidth);
		
		$(cssid ).css('width',totalWidth);    
		$(cssid ).css('margin','1em auto');    
		
		$(cssid + ' ul').css('height',perHeight * 9); 
		$(cssid + ' ul').css('width',widthUl);                                      
		$(cssid + ' ul').css('padding-left',widthUl);                                      
		$(cssid + ' ul').css('font-size',perHeight * 8);	                              
		$(cssid + ' ul.flip-clock-meridium').css('font-size',perHeight * 4);	                              
		$(cssid + ' ul').css('line-height',perHeight * 9.5 + 'px');             
		
																						  
		$(cssid + ' span').css('height',baseHeight);                                      
		$(cssid + ' span').css('width',widthSpan);                                    
		$(cssid + ' span.flip-clock-label').css('top',-perHeight * 3);                    
		$(cssid + ' span.flip-clock-label').css('right',-perHeight * 8.6);                
		$(cssid + ' span span.flip-clock-dot').css('width',perHeight);                    
		$(cssid + ' span span.flip-clock-dot').css('height',perHeight);                   
		$(cssid + ' span span.flip-clock-dot').css('left',perHeight/2);                   
		$(cssid + ' span span.flip-clock-dot').css('border','1px solid #1D1D1D');                   
		$(cssid + ' span span.flip-clock-dot.top').css('top',perHeight*3);                
		$(cssid + ' span span.flip-clock-dot.bottom').css('bottom',perHeight*3);          
	};
	
function runcallback(funcName, clock ){	
	if (funcName == 'interval'	){
		/*
		var time = clock.factory.getTime().time;		        		
			if(time) {
				console.log('interval', time);
			}
		*/
	} else
	if (funcName == 'init'		){
		
	} else
	if (funcName == 'start'		){
		clock.factory.setTime(  new Date )
	} else
	if (funcName == 'stop'		){
		
	} else
	if (funcName == 'reset'		){

	};			 
}

function createClock(id, content) {		
		var type = '';
		type = content.trim();
		if (type == ''){
			type = 'TwentyFourHourClock';
		}
		var clock = $("#"+id).FlipClock( 
				{					
					clockFace: type,
					autoStart: false,	
					callbacks:{									    
							interval: function() {  runcallback('interval'	,	this) },		//刷新
							init: 	  function() {  runcallback('init'		,	this) },		//初始化						
							start: 	  function() {  runcallback('start'		,	this) },		//初始化						
							stop:     function() {  runcallback('stop'		,	this) },        //停止
							reset:    function() {  runcallback('reset'		,	this) }         //重置							
					   } 	
				}
		);
		changeClockCSS('#'+id);
		return clock;
}

$(document)
	.on('sidebar.isShowing', function () {
		setTimeout( "$('.customFlipClock').css('visibility','visible')" , 200);
	})
	.on('sidebar.isHiding', function () {
		$('.customFlipClock').css("visibility","hidden");
	});	
	
$(document).ready(
function()
	{			
		var flipClockList = [];
		var arrFlipClock = getClass("div","customFlipClock");
		var flipClockHTML;

		for( var i=0;i < arrFlipClock.length; i++)
			{   					
				flipClockHTML = arrFlipClock[i];					
				var content = flipClockHTML.innerText;
				flipClockHTML.innerText = '';
				flipClockList[i] = createClock(flipClockHTML.id, content );			
			}
	
		for( var i=0;i < flipClockList.length; i++)
				{   
					flipClockList[i].start();	
				}					
		//setTimeout(function() {
		//	flipClockList[0].start();
		//	}, 500);
	}
);	
	
	
