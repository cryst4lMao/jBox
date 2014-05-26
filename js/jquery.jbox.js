// jQuery Alert Dialogs Plugin
// Version 1.1
// Author iancj 2014-04-09
// Visit http://github.com/iancj/jbox for more information

;(function($,document,window){

	//默认配置项
	var defaults={
		title:"提示",//标题
		width:"auto",//宽度
		height:"auto",//高度
		minWidth:400,//最小宽度
		minHeight:200,//最小高度
		content:"",//自定义内容
		onOpen:false,//打开弹窗时的回调
		onClosed:false,//关闭窗口后的回调
		btnOK:{//确定按钮参数
			text:"确定",//按钮显示文字
			show:true,//是否显示按钮
			extclass:"btn btn-blue",//按钮追加的样式
			onBtnClick:false//点击按钮的事件
		},
		btnCancel:{
			text:"取消",//按钮显示文字
			show:true,//是否显示按钮
			extclass:"btn",//按钮追加的样式
			onBtnClick:false//点击按钮的事件
		}
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
		// log(opts);
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
			$jbox_container=$('<div class="jbox-container"></div>'),
			$jbox_buttons=$('<div class="jbox-buttons"></div>');
			
			$jbox_title.append(
				'<div class="jbox-title-txt">'+title+'</div>',
				'<a href="javascript:;" class="jbox-close"></a>'
			);

			//是否显示确定按钮
			if(opts.btnOK.show){
				var $btn_ok=$('<a href="javascript:;" class="jbox-buttons-ok '+opts.btnOK.extclass+'">'+opts.btnOK.text+'</a>');

				//绑定点击按钮事件
				if(opts.btnOK.onBtnClick){
					$btn_ok.click(function(){
						opts.btnOK.onBtnClick.call(opts.trigger,$jbox);
					});
				}

				$jbox_buttons.append($btn_ok);
			}

			//是否显示取消按钮
			if(opts.btnCancel.show){
				var $btn_cancle=$('<a href="javascript:;" class="jbox-buttons-ok '+opts.btnCancel.extclass+'">'+opts.btnCancel.text+'</a>');

				//绑定点击按钮事件
				$btn_cancle.click(function(){
					//有自定义回调函数则执行自定义回调函数,否则默认执行触摸关闭事件
					if(opts.btnCancel.onBtnClick){
						opts.btnCancel.onBtnClick.call(opts.trigger,$jbox);
					}
					else{
						$jbox.find(".jbox-close").triggerHandler("click");
					}
				});

				$jbox_buttons.append($btn_cancle);
			}

			//更新内容
			$jbox_container.append($content);

			//若按钮之一为显示状态则将按钮组插入窗体
			if(opts.btnOK.show || opts.btnCancel.show){
				$jbox.append($jbox_title,$jbox_container,$jbox_buttons);
			}
			else{
				$jbox.append($jbox_title,$jbox_container);
			}

			//将窗体插入body中
			$("body").append($jbox);

			//重置窗体位置
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
					opts.onClosed.call(opts.trigger);
				}
				//移除窗体
				$jbox.remove();
				//关闭遮罩层
				_hideOverlay();

				return false;
			});

			//如果有onOpen回调，则执行
			if($jbox && callback){
				callback.call(opts.trigger,$jbox);
			}
	}

	// *****************
	// 私有方法
	// *****************

	//重置位置
	//@param $ele 要关闭的jBox jQuery对象
	//@param options 传入的新参数
	function _reposition($ele,options){
		var width=$ele.outerWidth(),//宽度
			height=$ele.outerHeight(),//高度
			$win=$(window),
			winHeight=$win.height(),//窗口高度
			winWidth=$win.width(),//窗口高度
			titleHeight=$ele.find(".jbox-title").outerHeight(),//标题高度
			buttonsHeight=$ele.find(".jbox-buttons").outerHeight(),//按钮组
			$container=$ele.find(".jbox-container"),//内容容器
			opts=_extendOpts(options);//合并参数


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
		
		$container.css("height",height-titleHeight-buttonsHeight-parseInt($container.css("paddingTop"))-parseInt($container.css("paddingBottom")));

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
			"opacity": 0.15
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

	//合并参数
	//@param newOpts 传入的新参数
	function _extendOpts(newOpts){
		var opts=null,
			opts_btnok=null,
			opts_btncancel=null;

		opts=$.extend({},defaults,newOpts);//合并所有参数
		opts_btnok=$.extend({},defaults.btnOK,newOpts.btnOK);//合并确定按钮参数
		opts_btncancel=$.extend({},defaults.btnCancel,newOpts.btnCancel);//合并取消按钮参数

		opts.btnOK=opts_btnok;
		opts.btnCancel=opts_btncancel;

		return opts;
	}

	// *****************
	// 公共方法
	// 使用格式: $("#box3").jBox();
	// *****************
	$.fn["jBox"]=function(options){
		return this.each(function(){
			var $self=$(this),
				rule=$self.data("rule") || "normal",
				opts=_extendOpts(options?options:{});
				opts.trigger=this;

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
	var publicmethod=$["jBox"]={};

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

	//使用格式: $.jBox.showloading();
	publicmethod.showloading=function(){
		var $loading=$("#jbox-loading");
		if(!$loading.length>0){
			var $loading=$('<div id="jbox-loading"><i></i></div>');
			$("body").append($loading);
		}
		$loading.fadeIn(200);
	}

	//使用格式: $.jBox.hideloading();
	publicmethod.hideloading=function(){
		$("#jbox-loading").fadeOut(200);
	}

	//使用格式: $.jBox.Close(element);
	publicmethod.close=function(element){
		$(element).find(".jbox-close").triggerHandler("click");
	}

}(jQuery,document,window));

//show log
// function log(msg){
// 	if(typeof console != "undefined"){
// 		console.log(msg);
// 	}
// 	else{
// 		alert(msg);
// 	}
// }