jBox
====

基于jquery的弹窗插件，主要有三个功能：
- 可以通过A标签的href属性弹出指定的内容
- 通过$(ele).jBox()直接弹出内容
- 通过$.jBox.show({content:"abc"})弹出自定义的内容

###示例及用法
**弹出A标签指向的内容**
```html
<a href="#box1" class="test1" title="弹出A标签指向的DOM" data-rule="box">box1</a>
```
```js
$(".test1").jBox();
```

**直接弹出指定内容**
```js
$("#box2").jBox();
```
**直接弹出自定义内容**
```js
var html='<input type="text" />';
	html+='<p>这是自定义的内容</p>';
	
$.jBox.show({
	title:"hello test",
	content:html
});
```
**关闭指定的窗口**

在onOpen回调函数中会传入一个jQuery对象```element```代表当前打开的窗口，通过$.jBox.close(ele)可以关闭指定的窗口
```js
$(".test1").jBox({  
    onOpen:function(element){  
        $("#btn_box1").click(function(){  
            $.jBox.close(element);  
        }); 
    }
});
```
**重置窗口位置**

这将重置页面上已打开的所有的窗口位置
```js
$.jBox.reposition();
```

**参数说明**
<table>
   <tr>
      <td>参数</td>
      <td>值的类型</td>
      <td>描述</td>
   </tr>
   <tr>
      <td>title</td>
      <td>String</td>
      <td>标题</td>
   </tr>
   <tr>
      <td>width</td>
      <td>Number</td>
      <td>宽度</td>
   </tr>
   <tr>
      <td>height</td>
      <td>Number</td>
      <td>高度</td>
   </tr>
   <tr>
      <td>minWidth</td>
      <td>Number</td>
      <td>最小宽度</td>
   </tr>
   <tr>
      <td>minHeight</td>
      <td>Number</td>
      <td>最小高度</td>
   </tr>
   <tr>
      <td>content</td>
      <td>String</td>
      <td>内容</td>
   </tr>
   <tr>
      <td>onOpen</td>
      <td>Function</td>
      <td>窗体打开时执行的回调函数</td>
   </tr>
   <tr>
      <td>onClosed</td>
      <td>Function</td>
      <td>窗体关闭后执行的回调函数</td>
   </tr>
   <tr>
      <td>
         btnOK <br>
          ·text <br>
          ·show <br>
          ·extclass <br>
          ·onBtnClick
      </td>
      <td>
         Object <br>
          ·String <br>
          ·Boolean <br>
          ·String <br>
          ·Boolean <br>
      </td>
      <td>
         确定按钮参数 <br>
          ·按钮的显示文字 <br>
          ·是否显示按钮 <br>
          ·按钮追加的样式 <br>
          ·点击按钮的事件 <br>
      </td>
   </tr>
   <tr>
      <td>
         btnCancle <br>
          ·text <br>
          ·show <br>
          ·extclass <br>
          ·onBtnClick
      </td>
      <td>
         Object <br>
          ·String <br>
          ·Boolean <br>
          ·String <br>
          ·Boolean <br>
      </td>
      <td>
         取消按钮参数 <br>
          ·按钮的显示文字 <br>
          ·是否显示按钮 <br>
          ·按钮追加的样式 <br>
          ·点击按钮的事件 <br>
      </td>
   </tr>
</table>