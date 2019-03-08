'use strict';

/**
 * @author mikixing
 * [Carousel description]
 * @param ele:轮播挂载元素
 */
function setLeft(e, l) {
	e.style.left = l + 'px';
}
function clearTimer(timer, type) {
	type = +type || 1;
	if (type === 1) {
		clearInterval(timer);
	} else {
		clearTimeout(timer);
	}
}
function Carousel(ele) {
	this.ele = ele;
	this.bar;
	this.left = 0;
	this.w = this.ele.offsetWidth || 300;
	this.h = this.ele.offsetHeight || 200;
	this.timer = [];
	this.index = 1;
	this.len;
	this.prev;
	this.next;
	this.init();
}
Carousel.prototype.init = function () {
	var items,
	    that,
	    startPoint,
	    startEle,
	    curPoint,
	    distance = 0,
	    touchTimer = [];

	this.ele.className += ' ' + 'miki-swiper';
	this.bar = this.ele.getElementsByClassName('bar')[0];
	this.bar.style.left = 0;
	items = this.bar.getElementsByClassName('item');
	this.len = items.length;
	that = this;
	startPoint = 0;
	startEle = 0;
	curPoint;

	for (var i = 0; i < this.len; i++) {
		items[i].style.width = this.w + 'px';
		items[i].style.height = this.h + 'px';
	}
	this.bar.style.width = this.w * this.len * 2 + 'px';
	this.bar.style.height = this.h + 'px';
	//将轮播图片复制一份并追加到原来图片的后面
	this.bar.innerHTML += this.bar.innerHTML;
	//移动端不添加向前,向后按钮
	if (!/Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent)) {
		createBtn();
		this.prev = this.ele.getElementsByClassName('prev')[0];
		this.next = this.ele.getElementsByClassName('next')[0];
		this.prev.onclick = function () {
			that.stop();
			prevPic(that);
			that.showNav();
			that.move(that);
		};
		this.next.onclick = function () {
			console.log('next')
			that.stop();
			nextPic(that);
			that.showNav();
			that.move(that);
		};
	}
	createNav();
	this.showNav();
	this.move(this);
	bindEvent();

	function bindEvent() {
		// that.ele.addEventListener('mouseover', function (ev) {
		// 	that.stop();
		// 	if (ev.target.className === 'navigation_index') {
		// 		var e = ev.target;
		// 		showPic(e.dataset.index);
		// 		that.index = +e.dataset.index;
		// 		that.showNav();
		// 	}
		// 	return;
		// });
		// that.ele.addEventListener('mouseout', function (ev) {
		// 	if (ev.target.className === 'navigation_index') {
		// 		that.showNav();
		// 		that.move(that);
		// 	}
		// 	return;
		// });
		that.ele.addEventListener('transitionend', function () {
			that.stop();
			that.bar.style.transitionDuration = '';
			if (that.index > that.len) {
				that.index = that.index % that.len ? that.index % that.len : 1;
				that.left = -(that.index - 1) * that.w;
				setLeft(that.bar, that.left);
			}
			that.showNav();
			that.move(that);
		});
		that.ele.ontouchstart = function (ev) {
			that.bar.style.transitionDuration = '';
			that.stop();
			ev.preventDefault();
			startPoint = ev.changedTouches[0].pageX;
			startEle = that.bar.offsetLeft;
		};
		that.ele.ontouchmove = function (ev) {
			for (var i = 0; i < touchTimer.length; i++) {
				clearTimer(touchTimer[i], 2);
			}
			curPoint = ev.changedTouches[0].pageX;
			distance = curPoint - startPoint;
			if (that.index === 1 && distance > 0) {
				that.left = -that.w * that.len + distance;
				that.bar.style.left = that.left + 'px';
			} else {
				that.left = startEle + distance;
				that.bar.style.left = that.left + 'px';
			}
		};
		that.ele.ontouchend = function (ev) {
			for (var i = 0; i < touchTimer.length; i++) {
				clearTimer(touchTimer[i], 2);
			}
			that.bar.style.transitionDuration = '.3s';
			if (Math.abs(distance) >= that.w / 3) {
				if (distance > 0) {
					if (that.index === 1) {
						that.index = that.len + 1;
					}
					prevPic(that);
					that.showNav();
				} else {
					if (that.index === that.len * 2) {
						that.index = that.len;
					}
					nextPic(that);
					that.showNav();
				}
			} else {
				if (that.index === 1 && distance > 0) {
					that.index = that.len + 1;
				}
				if (that.index === that.len * 2 && distance < 0) {
					that.index = that.len;
				}
				showPic(that.index);
				//如果distance===0,无法触发transitionend事件,通过移动一点点距离来触发
				if (Math.abs(distance) === 0) {
					that.bar.style.left = that.bar.offsetLeft - 0.1 + 'px';
				}
			}
			distance = 0;
		};
	}
	function createNav() {
		var navLen = that.len;
		var navBar = document.createElement('div');
		navBar.className = 'navigation';
		navBar.style.marginLeft = -(navLen * 22 + 6) / 2 + 'px';
		var tpl = '';

		for (var i = 0; i < navLen; i++) {
			tpl += '<div class="navigation_index" data-index=' + (i + 1) + '><div class="navigation_index_inner"></div></div>';
		}
		navBar.insertAdjacentHTML('beforeEnd', tpl);
		that.ele.appendChild(navBar);
	}
	function createBtn() {
		var tpl = '<div class="control_button"><div class="prev"></div><div class="next"></div></div>';
		that.ele.insertAdjacentHTML('beforeEnd', tpl);
	}
	function showPic(index) {
		that.index = index;
		that.left = -(that.index - 1) * that.w;
		setLeft(that.bar, that.left);
		that.showNav();
		that.stop();
	}
	function prevPic(that) {
		if (that.index === 1) {
			that.index = that.len * 2;
			that.left = -that.w * (that.len * 2 - 1);
			setLeft(that.bar, that.left);
		} else {
			that.left = -that.w * (that.index - 2);
			setLeft(that.bar, that.left);
			that.index = that.index - 1;
		}
	}
	function nextPic(that) {
		if (that.index === that.len * 2) {
			that.index = 1;
			that.left = 0;
			setLeft(that.bar, that.left);
		} else {
			that.left = -that.w * that.index;
			setLeft(that.bar, that.left);
			that.index = that.index + 1;
		}
	}
};
Carousel.prototype.move = function (that) {
	var timer = setInterval(function () {
		that.bar.style.transitionDuration = '.3s';
		that.left = -that.index * that.w;
		setLeft(that.bar, that.left);
		that.index = that.index + 1;
	}, 2000);
	var tmp = that.timer.some(function (v) {
		return v === timer;
	});
	if (!tmp) {
		that.timer.push(timer);
	}
};

Carousel.prototype.stop = function () {
	for (var i = 0; i < this.timer.length; i++) {
		clearTimer(this.timer[i], 1);
	}
	this.timer = [];
};
Carousel.prototype.showNav = function () {
	var pColor = 'hsla(0,10%,100%,0.2)';
	var sColor = '#fff';
	var index = this.index % this.len || this.len;

	function showColor(ele) {
		ele.style.backgroundColor = pColor;
		ele.firstChild.style.backgroundColor = sColor;
		ele.firstChild.style.borderColor = '#fff';
	}
	function removeColor(ele) {
		ele.style.backgroundColor = '';
		ele.firstChild.style.backgroundColor = '';
		ele.firstChild.style.borderColor = '#b9beba';
	}
	[].slice.call(this.ele.getElementsByClassName('navigation_index')).forEach(function (ele, i) {
		ele.dataset.index == index ? showColor(ele) : removeColor(ele);
	});
};
