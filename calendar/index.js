/**
 * Create by mikixing
 * a calendar constructor
 */

var nonleapYear = [31,28,31,30,31,30,31,31,30,31,30,31]     //平年
var leapYear = [31,29,31,30,31,30,31,31,30,31,30,31]	    //闰年

function slice (obj) {
	return [].slice.call(obj)
}
function rmCls (e, cls) {
	cls = typeof cls === 'string' ? cls.trim() : '';
	var list = (e.className || '').split(/\s+/);
	e.className = list.filter(function (v) {
		return v !== cls
	})
	.join(' ');
}
function addCls (e, cls) {
	rmCls(e, cls);
	e.className += ' ' + cls;
}
function findCls (e, cls) {
	var sty = e.className
	var res = sty.split(/\s+/g).some(function (v) {
		return v === cls
	})
	return res
}
/**
 * [isWrapped description]
 * @param  {[object]}  a [包含元素]
 * @param  {[object]}  b [被包含元素]
 * @return {Boolean}   [b是否包含a]
 */
function isWrapped (a, b) {
	do {
		if (a === b || (a.parentNode && a.parentNode === b)) return true
	} while (a = a.parentNode)
	return false
}
function getPos (e) {
    let pos = {left: 0, top: 0};
    do {
        pos.left += e.offsetLeft;
        pos.left -= e.scrollLeft || 0;
        pos.top += e.offsetTop;
        pos.top -= e.scrollTop || 0;
        if ( window.getComputedStyle(e)['position'] === 'fixed' ) {
            return pos;
        }
    } while (e = e.offsetParent);
    pos.top -= document.documentElement.scrollTop || document.body.scrollTop;
    pos.left -= document.documentElement.scrollLeft || document.body.scrollLeft;
    return pos;
}
function remove (e) {
	e.remove()
}

function Calendar (ele, year, month, date, change) {
	if (!(ele instanceof Element)) {
		throw new Error('ele缺失')
	}
	var now = new Date
	this.ele = ele
	this.year = +year || +now.getFullYear()
	this.month = month || +now.getMonth() + 1
	this.date = +date || +now.getDate()
	this.calendar
	this.calendarList
	this.change = change || ''
	this.init()
}
Calendar.prototype.init = function () {
	var matte = document.createElement('div')
	matte.className = 'matte'
	document.body.appendChild(matte)
	this.ele.onkeydown = function (ev) {
		return false
	} 
	this.ele.style.position = 'relative'
    this.calendar = document.createElement('div')
    this.calendar.className = 'calendar'
	this.calendar.onselectstart = function () {return false}
	var tab = `<div class="calendar-title fit">
					<div class="calendar-top arrow pre-year"><</div>
					<div class="calendar-top text num-year">${this.year}</div>
					<div class="calendar-top arrow next-year">></div>
					<div class="calendar-top text text-year">年</div>
					<div class="calendar-top arrow pre-month"><</div>
					<div class="calendar-top text num-month">${this.month}</div>
					<div class="calendar-top arrow next-month">></div>
					<div class="calendar-top text text-month">月</div>
				</div>`
	var week = `<div class="calendar-week fit">
					<div class="weekday rest">日</div>
					<div class="weekday">一</div>
					<div class="weekday">二</div>
					<div class="weekday">三</div>
					<div class="weekday">四</div>
					<div class="weekday">五</div>
					<div class="weekday rest">六</div>
				</div>`
	this.calendar.innerHTML += tab
	this.calendar.innerHTML += week

	var pos = getPos(this.ele)
	var top = this.ele.offsetHeight
	document.body.appendChild(this.calendar)
	this.calendar.style.left = pos.left + 'px'
	this.calendar.style.top = pos.top + top + 'px'
	var calendar = this.calendar
	setTimeout(function () {
		calendar.style.transitionDuration = '.3s'
		calendar.style.top = pos.top + top + 5 + 'px'
	}, 0)
	this.create()
	this.bindEvent()
}
Calendar.prototype.create = function () {
	var count = 0
	var countDay
	var firstDay
	var lastDay
	var countPreMonth
	var countNextMonth
	var preMonthDay
	var nextMonthDay
	var calendarItem
	var temp
	var now = new Date(new Date().toLocaleDateString()).getTime()  //获得当天0点时间戳

	if (this.calendarList) {
		this.calendarList.remove()
	}
	this.calendarList = document.createElement('div')
	this.calendarList.className = 'calendar-list'
	firstDay = new Date(this.year + '-' + this.month + '-' + 1).getDay()     //1号是周几
	preMonthDay = firstDay      //上一个月应该出现在日历里几天                                       
	this.calendarList.className = 'calendar-list fit'

	if (this.year % 100 === 0 ? this.year % 400 === 0 : this.year % 4 === 0) {
		countDay = leapYear[this.month - 1]
	} else {
		countDay = nonleapYear[this.month - 1]
	}
	if (this.month === 1) {
		countPreMonth = nonleapYear[11]
	} else {
		countPreMonth = nonleapYear[this.month - 2]      //数组编号从0开始
	}
	if (this.month === 12) {
		countNextMonth = nonleapYear[0]
	} else {
		countNextMonth = nonleapYear[this.month]
	}
	lastDay = new Date(this.year + '-' + this.month + '-' + countDay).getDay()
	nextMonthDay = 6 - lastDay         //下一个月应该出现在日历里几天
	if (preMonthDay) {
		for (let i = preMonthDay - 1; i >= 0; i--) {
			let tpl = `<div class="calendar-item preday disable" title=${this.year + '-' + (this.month - 1) + '-' + (countPreMonth - i)}>${countPreMonth - i}</div>`
			this.calendarList.innerHTML += tpl
		}
	}
	while (countDay - count) {
		count++
		let tpl = count === this.date ?  `<div class="calendar-item today active" title=${this.year + '-' + this.month + '-' + count}>${count}</div>` : `<div class="calendar-item today" title=${this.year + '-' + this.month + '-' + count}>${count}</div>`
		this.calendarList.innerHTML += tpl
	}
	if (nextMonthDay) {
		for (let i = 1; i <= nextMonthDay; i++) {
			let tpl =  `<div class="calendar-item nextday disable" title=${this.year + '-' + (this.month + 1) + '-' + i}>${i}</div>`
			this.calendarList.innerHTML += tpl
		}
	}
	this.calendar.appendChild(this.calendarList)
}
Calendar.prototype.bindEvent = function () {
	var matte = document.getElementsByClassName('matte')[0]
	var calendar = document.getElementsByClassName('calendar')[0]
	var nextMonth = calendar.getElementsByClassName('next-month')[0]
	var preMonth = calendar.getElementsByClassName('pre-month')[0]
	var nextYear = calendar.getElementsByClassName('next-year')[0]
	var preYear = calendar.getElementsByClassName('pre-year')[0]
	var numYear = calendar.getElementsByClassName('num-year')[0]
	var numMonth = calendar.getElementsByClassName('num-month')[0]
	var that = this
	matte.addEventListener('click', function () {
		remove(calendar)
		remove(matte)
	}, false)
	calendar.addEventListener('click', function (ev) {
		var e = ev.target
		var preS = e.previousElementSibling
		var nextS = e.nextElementSibling

		if (!isWrapped(e, calendar) || !findCls(e, 'today')) return
		while (preS) {
			rmCls(preS, 'active')
			preS = preS.previousElementSibling
		}
		while (nextS) {
			rmCls(nextS, 'active')
			nextS = nextS.nextElementSibling
		}
		rmCls(e, 'hover-in')
		addCls(e, 'active')
		if (that.change && typeof that.change === 'function') {
			that.change(e.title)
		} else {
			that.ele.value = e.title
		}
		remove(calendar)
		remove(matte)
		return e.title

	}, false)
	calendar.addEventListener('mouseover', function (ev) {
		var e = ev.target
		if (findCls(e, 'active') || findCls(e, 'preday') || findCls(e, 'nextday')) return
		slice(calendar.getElementsByClassName('calendar-item')).map(el => rmCls(el, 'hover-in'))
		if (findCls(e, 'calendar-item')) {
			addCls(e, 'hover-in')
		}

	}, false)
	calendar.addEventListener('mouseout', function (ev) {
		slice(calendar.getElementsByClassName('calendar-item')).map(el => rmCls(el, 'hover-in'))
	}, false)
	nextMonth.onclick = function () {
		if (numMonth.innerHTML < 12) {
			numMonth.innerHTML = +numMonth.innerHTML + 1
			that.month++
		} else {
			numMonth.innerHTML = 1
			that.month = 1
			that.year++
		}
		numYear.innerHTML = that.year
		that.create()
	}
	preMonth.onclick = function () {
		if (numMonth.innerHTML > 1) {
			numMonth.innerHTML = +numMonth.innerHTML - 1
			that.month--
		} else {
			numMonth.innerHTML = 12
			that.month = 12
			that.year--
		}
		numYear.innerHTML = that.year
		that.create()
	}
	nextYear.onclick = function () {
		that.year++
		numYear.innerHTML = that.year
		that.create()
	}
	preYear.onclick = function () {
		that.year--
		numYear.innerHTML = that.year
		that.create()
	}

}
