//辅助函数
function bind (ele, type, fn) {
	ele.addEventListener(type, fn, false)
}
function unbind (ele, type, fn) {
	ele.removeEventListener(type, fn)
}
function removeCls (ele, cls) {
	var arr = ('' + ele.className).split(/\s+/g)
	var newCls = arr.map(name => {
		if (name.trim() === cls) return
		return name
	}).join(' ')
	ele.className = newCls
}
function hasCls (ele, cls) {
	var arr = ('' + ele.className).split(/\s+/g)
	if (arr.indexOf(cls) >= 0) return true
}
function scrollT (ele) {
	var count = 0
	do {
		if (ele === document.body) {
			count += document.documentElement.scrollTop
		} else {
			count +=ele.scrollTop
		}
		ele = ele.offsetParent
	} while (ele)
	return count
}
function changeItem(a, b) {
	var tmpI = a.index
	var tmpT = a.t
	var tmpL = a.l
	a.index = b.index
	a.t = b.t
	a.l = b.l
	b.index = tmpI
	b.t = tmpT
	b.l = tmpL
}
//----------类实现----------
;(function (factory) {
  if(typeof module === 'object' && module.exports) {
    module.exports = factory;
  } else {
    window.drag = factory;
  }
})(new DragSort)
function DragSort () {}
DragSort.prototype.resort = function (arr) {
	var box = this.ele
	var lists = [].slice.call(box.children)
	for (var i = 0; i < lists.length; i++) {
		if (hasCls(lists[i], 'miki-drag')) continue
		lists[i].remove()
	}
	arr.forEach(child => {
		box.appendChild(child)
	})
}
DragSort.prototype.init = function (ele, fn, type) {
	var z = 10
	var hold
	var that = this
	var items = []
	this.ele = ele
	if (!this.ele) {
		throw new Error('挂载元素必传!')
	}
	items = [].slice.call(that.ele.children)
	//将所有子元素的定位转换
	for (var i = items.length - 1; i >= 0; i--) {
		var item = items[i]
		item.l = item.offsetLeft
		item.t = item.offsetTop
		item.index = i
		item.style.position = 'absolute'
		item.style.left = item.l + 'px'
		item.style.top = item.t + 'px'
	}
	that.ele.style.overflow = 'scroll'
	bind(that.ele, 'mousedown', function (ev) {
		var target = ev.target
		if (!hasCls(target, 'miki-dragSort')) {
			do {
				target = target.parentNode
			} while (target !== null && !hasCls(target, 'miki-dragSort'))
		}
		if (!target || !hasCls(target, 'miki-dragSort')) return
		target.style.transition = ''
		var mark = target.nextElementSibling
		target.className += ' miki-drag'
		target.style.zIndex = ++z
		var y = ev.clientY
		var item = items[0]
		var w = item.offsetWidth
		var h = item.offsetHeight
		hold = document.createElement(item.nodeName.toLowerCase())
		hold.style.width = w + 'px'
		hold.style.height = h + 'px'
		hold.index = target.index
		hold.now = target.index
		hold.l = target.l
		hold.t = target.t
		hold.style.left = hold.l + 'px'
		hold.style.top = hold.t + 'px'
		hold.style.position = 'absolute'
		hold.style.className = 'emp'
		items[target.index] = hold
		that.ele.insertBefore(hold, mark)
		var moveFn, upFn, endFn;
		
		bind(document, 'mousemove', moveFn = function (ev) {
			type = type || 'part'
			var dy = ev.clientY - y
			target.style.top = target.t + dy + 'px'
			items.forEach(e => {
				if (e.index === target.index) return
				var dt = ev.clientY - that.ele.offsetTop + scrollT(that.ele)
				if (e.offsetTop <= dt && e.offsetTop + e.offsetHeight >= dt) {
					var cItem = e
					if (type === 'mutual') {
						hold.now = cItem.index
						return
					}
					changeItem(hold, cItem)
					cItem.style.left = cItem.l + 'px'
					cItem.style.top = cItem.t + 'px'
					hold.style.left = hold.l + 'px'
					hold.style.top = hold.t + 'px'
					items[cItem.index] = cItem
					items[hold.index] = hold
					that.resort(items)
					target.index = hold.index	
				}
			})
		})
		bind(document, 'mouseup', upFn = function (ev) {
			bind(document, 'transitionend', endFn = function (ev) {
				target.style.transition = ''
				hold.remove()
				that.resort(items)
				fn && fn()
				unbind(document, 'transitionend', endFn);
			})
			var r = items[hold.now]
			if (type === 'mutual') {
				changeItem(r, hold)
				changeItem(hold,target)
				r.style.top = r.t + 'px'
				target.style.transition = 'top .3s'
				target.style.top = target.t + 'px'
				target.style.zIndex = ''
				items[r.index] = r
				items[target.index] = target
			} else {
				changeItem(hold, target)
				items[target.index] = target
				target.style.transition = 'top .3s'
				target.style.top = target.t + 'px'
				target.style.zIndex = ''
			}
			unbind(document, 'mousemove', moveFn);
			unbind(document, 'mouseup', upFn);
			removeCls(target, 'miki-drag')
			if (!(ev.clientY - y)) {
				hold.remove()
				that.resort(items)
				return
			}
		})
	})
}