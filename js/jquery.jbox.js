// jQuery Alert Dialogs Plugin
// Version 1.0
// Author iancj 2014-04-09
// Visit http://github.com/iancj/jbox for more information

(function($,document,window){

	//默认配置项
	var defaults={
		title:"提示",//标题
		width:"auto",//宽度
		height:"auto",//高度
		minWidth:400,//最小宽度
		minHeight:200,//最小高度
		content:"",//自定义内容
		onOpen:false,//打开弹窗时的回调
		onClosed:false//关闭窗口后的回调
	};

	var isIE=$.browser.msie,
		ieVersion=parseInt($.browser.version);

	//构造函数
	function JBox(param){
		this.title=param.title;//标题
		this.selector=param.selector;//内容选择器
		this.$content=param.$content || null;//内容
		this.$curParent=null;//原始内容父容器
	}

	//创建窗体
	JBox.prototype.create=function(opts,callback){
		var	title=this.title,//弹窗显示的标题
			selector=this.selector,//弹窗的目标选择器
			$content=null,//弹出的内容
			$curParent=null;//弹出内容原先所在的容器

			//获取由A标签指向的内容或者对象本身
			this.$content= $content = this.$content ? this.$content : $(selector);
			//获取内容所在的父容器
			try{
				this.$curParent = $curParent = $content.parent();
			}
			catch(e){}


		//append  html
		var $jbox=$('<div class="jbox"></div>'),
			$jbox_title=$('<div class="jbox-title"></div>'),
			$jbox_container=$('<div class="jbox-container"></div>');

			$jbox_title.append(
				'<div class="jbox-title-txt">'+title+'</div>',
				'<a href="javascript:;" class="jbox-close"></a>'
				)

			$jbox_container.append($content);

			$jbox.append($jbox_title,$jbox_container);

			$("body").append($jbox);

			//重置窗体
			_reposition($jbox,opts);
			//显示遮罩层
			_showOverlay();

			//每个弹窗的关闭事件
			$jbox.find(".jbox-close").one("click",function(){
				try{
					$content.appendTo($curParent);//还原内容到其原始的节点
				}
				catch(e){}
				//如果有关闭回调事件则执行
				if(opts.onClosed){
					opts.onClosed();
				}
				//移除窗体
				$jbox.remove();
				//关闭遮罩层
				_hideOverlay();

				return false;
			});

			//如果有onOpen回调，则执行
			if($jbox){
				if(callback){
					callback($jbox);
				}
			}
	}

	// *****************
	// 私有方法
	// *****************
	//重置位置
	function _reposition($ele,options){
		var width=$ele.outerWidth(),//宽度
			height=$ele.outerHeight(),//高度
			$win=$(window),
			winHeight=$win.height(),//窗口高度
			winWidth=$win.width(),//窗口高度
			titleHeight=$ele.find(".jbox-title").outerHeight(),//标题高度
			$container=$ele.find(".jbox-container"),//内容容器
			opts=$.extend({},defaults,options);//合并配置项

		if(opts.width=="auto"){
			if(width<opts.minWidth){
				width=opts.minWidth;
			}
			if(width>900){
				width=900;
			}
		}
		else{
			width=opts.width;
		}

		if(width>=winWidth){
			width=winWidth-50;
		}

		if(opts.height=="auto"){
			if(height<opts.minHeight){
				height=opts.minHeight;
			}
			if(height>=winHeight){
				height=winHeight-100;
			}
		}
		else{
			height=opts.height;
		}

		if(height>=winHeight){
			height=winHeight-50
		}
		
		$container.css("height",height-titleHeight-parseInt($container.css("paddingTop"))-parseInt($container.css("paddingBottom")));

		$ele.css({
			"position":"fixed",
			"width":width,
			"height":height,
			"left":"50%",
			"top":"50%",
			"marginLeft":-parseInt(width/2),
			"marginTop":-parseInt(height/2),
			"zIndex":99999
		});

		//hack for ie6
		if(isIE && ieVersion <=6){
			var scrolltop=parseInt($win.scrollTop());
			$ele.css({
				"position":"absolute",
				"top":winHeight/2+scrolltop
			});
		}
	}

	//显示遮罩
	function _showOverlay(){
		if($("#jbox-overlay").length<1){
			$("body").append('<div id="jbox-overlay"></div>');
		}
		
		var $overlay=$("#jbox-overlay"),
			$win=$(window),
			bodyHeight=$("body").height(),
			winHeight=$win.height(),
			height=bodyHeight<winHeight ? winHeight : bodyHeight;

		$overlay.css({
			"position": 'fixed',
			"zIndex": 99998,
			"top": '0px',
			"left": '0px',
			"width": '100%',
			"height": height,
			"background": "#000",
			"opacity": 0.5
		});

		//hack for ie6
		if(isIE && ieVersion <=6){
			var scrolltop=parseInt($win.scrollTop());
			$overlay.css({
				"position": 'absolute',
				"top": scrolltop
			});
		}

		$overlay.show();
	}

	//隐藏
	function _hideOverlay(){
		$("#jbox-overlay").fadeOut(200);
	}

	// *****************
	// 公共方法
	// 使用格式: $("#box3").jBox();
	// *****************
	$.fn["jBox"]=function(options){
		return this.each(function(){
			var $self=$(this),
				rule=$self.data("rule") || "normal",
				opts=$.extend({},defaults,options);

			if(rule=="box"){
				$self.click(function(){
					var newBox=new JBox({
						title:$self.attr("title") || opts.title,
						selector:$self.attr("href")
					});
					newBox.create(opts,opts.onOpen);

					return false;
				});	
			}
			else{
				var newBox=new JBox({
					title:opts.title,
					$content:$self
				});
				newBox.create(opts,opts.onOpen);
			}

		});
	};

	// *****************
	// 公共静态方法
	// *****************
	publicmethod=$["jBox"]={};

	//使用格式: $.jBox.show();
	publicmethod.show=function(options){
		var opts=$.extend({},defaults,options),
			newBox=new JBox({
				title:opts.title,
				$content:opts.content
			});

		newBox.create(opts,opts.onOpen);
	}

	//使用格式: $.jBox.reposition();
	publicmethod.reposition=function(){
		$(".jbox").each(function(){
			_reposition($(this));
		});
	};

	//使用格式: $.jBox.Close(element);
	publicmethod.close=function(element){
		$(element).find(".jbox-close").triggerHandler("click");
	}

}(jQuery,document,window));

//show log
function log(msg){
	if(typeof console != "undefined"){
		console.log(msg);
	}
	else{
		alert(msg);
	}
}