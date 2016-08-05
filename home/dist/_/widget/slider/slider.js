'use strict';

/**
 * @author liangkeno
 * @date 2016-7-29
 * @desc 幻灯片
 */		
var slider=(function(){

	//滚动模块
	var moveBlock=(function(){
		var timer;
		return {
			getStyle:function(dom,attr){
				if(dom.currentStyle){
					return dom.currentStyle[attr];
				}else{
					return getComputedStyle(dom,false)[attr];
				}
			},
			startMove:function(dom,json,time){
				if(timer){
					clearInterval(timer);
				}
				timer=setInterval(function(){				
					moveBlock.doMove(dom,json);
				},time);
			},
			//根据json属性设置切换效果，此处为left
			doMove:function(dom,json){
				for(var attr in json){
					var curSize=parseInt(this.getStyle(dom,attr));					
					var speed=(json[attr]-curSize)/6;
					speed=speed>0?Math.ceil(speed):Math.floor(speed);
					dom.style[attr]=curSize+speed+'px';
					if(curSize==json[attr]){
						clearInterval(timer);
					}					
				}
			}
		};
	})();

	var sliderModule=(function(){
		var clickCount=0,autoTime,len,sliderObj,pageList=new Array();		
		return {
			//初始化slider宽度
			initFn:function(obj){
				//css3 
				var i;
				//初始化此模块对象
				sliderObj=obj;
				//根据屏幕初始化全屏slider
				len=sliderObj.i_dom.length;
				sliderObj.w_dom.style.width=len*sliderObj.c_width+"px";
				sliderObj.w_dom.style.left=-clickCount*sliderObj.c_width+'px';
				for(i=0;i<len;i++ ){
					sliderObj.i_dom[i].style.width=sliderObj.c_width+"px";
				}
			},
			navPage:function(){
				var pDom=document.createElement('div');
				pDom.setAttribute('class','navPage');
				for(var i=0;i<len;i++){
					var aDom=document.createElement('a');
					if(i==0){
						aDom.setAttribute('class','active');
					}			
					aDom.innerHTML=i+1;
					pDom.appendChild(pageList[i]=aDom);
				}
				sliderObj.w_dom.parentNode.appendChild(pDom);

			},
			setActivePage:function(count){					
				for(var i=0;i<pageList.length;i++){
					pageList[i].setAttribute('class','');
				}							
				pageList[count].setAttribute('class','active');													
			},
			curPage:function(){
				var event,target;
				event=EventUtil.getEvent(event);
				target=EventUtil.getTarget(event);
				if(target.nodeName=='A'){					
					clearInterval(autoTime);				
					clickCount=parseInt(target.innerHTML-1);
					sliderModule.setActivePage(clickCount);
					moveBlock.startMove(sliderObj.w_dom,{left:-sliderObj.c_width*clickCount},20);
				}
			},
			startSlider:function(){
				var event;
				event=EventUtil.getEvent(event);			
				//设置几秒自动滚动
				setTimeout(function(){
					sliderModule.autoScroll();
				},sliderObj.delay_time);	
				EventUtil.stopPropagation(event);					
			},
			stopSlider:function(){
				var event;
				event=EventUtil.getEvent(event);			
				if(autoTime){
					clearInterval(autoTime);
				}
				EventUtil.stopPropagation(event);		
			},
			scrollX:function(direction){
				clearInterval(autoTime);
				//判断单击索引				
				if(direction=="left"){
					if(clickCount>=len-1){
						clickCount=0;
					}else{
						clickCount=clickCount+1;
					}										
				}
				if(direction=="right"){
					if(clickCount==0 || clickCount<1){
						clickCount=len-1;
					
					}else{
						clickCount=clickCount-1;
					}	
				}	
				this.setActivePage(clickCount);
				//根据单击索引，开始滚动
				moveBlock.startMove(sliderObj.w_dom,{left:-sliderObj.c_width*clickCount},20);
				EventUtil.stopPropagation(event);
			},
			autoScroll:function(){
				if(autoTime){
					setInterval(autoTime);
				}			
				autoTime=setInterval(function(){
					if(clickCount >= len-1){
						clickCount=0;
					}else{
						clickCount++;
					}							
					moveBlock.startMove(sliderObj.w_dom,{left:-sliderObj.c_width*clickCount},20);					
					sliderModule.setActivePage(clickCount);
				},sliderObj.auto_time);			
			}			
		}
	})();

	//定义操作参数对象
	var obj={
		i_dom:document.querySelectorAll('.inner-wrap'),
		w_dom:document.querySelector('.out-wrap'),
		n_dom:document.querySelector('.navPage'),
		c_width:document.documentElement.clientWidth,
		auto_time:4000,
		delay_time:1000
	}

	//执行初始化,及自动播放
	sliderModule.initFn(obj);
	sliderModule.autoScroll();
	sliderModule.navPage();

	//监听resize的事件
	var handerResize=function(e){
		var curSreenWidth=document.documentElement.clientWidth;		
		obj.c_width=curSreenWidth;
		sliderModule.initFn(obj);
	}
	EventUtil.addHandler(window,'resize',handerResize);

	//代理监听滚动单击
	var handerSlider=function(event){
		var event,target,sliderWidth,preveTime,curTime;
		event=EventUtil.getEvent(event);
		target=EventUtil.getTarget(event);
		sliderWidth=document.documentElement.clientWidth;
		//防止用户连续点击
		preveTime=target.parentNode.getAttribute('preveTime');
		curTime=new Date().getTime();
		if(preveTime==undefined || (curTime-preveTime)>1000){		
			target.parentNode.setAttribute('preveTime',curTime);			
			switch(target.parentNode.id || target.innerHTML){
				case "next":
				sliderModule.scrollX("left");
				EventUtil.stopPropagation(event);
				break;
				case "prev":
				sliderModule.scrollX("right");
				EventUtil.stopPropagation(event);
				break;
			}
		}
	}
	var slider=document.querySelector('.slider_b');
	EventUtil.addHandler(slider,'click',handerSlider);	
	EventUtil.addHandler(slider,'mouseleave',sliderModule.startSlider);
	EventUtil.addHandler(slider,'mouseenter',sliderModule.stopSlider);
	//监听鼠标滑动到导航页
	EventUtil.addHandler(document.querySelector('.navPage'),'mouseover',sliderModule.curPage);	
		

})();