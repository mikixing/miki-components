### 安装

```javascript
$ npm i miki-dragSort
```

或者直接引入

```javascript
<script src="https://mikixing.github.io/miki-components/miki-dragSort/index.js"></script>
<link href="https://mikixing.github.io/miki-components/miki-dragSort/style.css"/>
```

### 特性

* 引入miki-dragSort,drag会自动挂到全局变量下
* 参数有三,第一个参数为必须,其他两个随意,可以无序传参
* 两种拖拽交换,局部交换和两两交换,默认情况下是局部交换,两两交换传('mutual')

### 使用

html

```javascript
<ul id="list" >
	<li class="miki-dragSort drag-li">1</li>
	<li class="miki-dragSort drag-li">2</li>
	<li class="miki-dragSort drag-li">3</li>
	<li class="miki-dragSort drag-li">4</li>
	<li class="miki-dragSort drag-li">5</li>
	<li class="miki-dragSort drag-li">6</li>
	<li class="miki-dragSort drag-li">7</li>
	<li class="miki-dragSort drag-li">8</li>
	<li class="miki-dragSort drag-li">9</li>
	<li class="miki-dragSort drag-li">10</li>
</ul>
```

js

```javascript
var box = document.getElementById('list')
drag.init(box, function () {console.log('test')})
```

