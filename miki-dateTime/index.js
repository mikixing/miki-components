
function pos (ele) {
    var l = ele.offsetLeft
    var t = ele.offsetTop
    while (ele = ele.offsetParent) {
        l += ele.offsetLeft
        t += ele.offsetTop
    }
    return {left: l, top: t}
}
function hasCls (ele, cls) {
    var arr = ele.className.split(/\s+/g)
    var res = arr.filter(function (e) {
        return e === cls
    })
    if (res.length > 0) return true
}
function removeCls (ele, cls) {
    cls = cls.trim()
    var arr = ele.className.split(/\s+/g)
    var brr = arr.filter(e => e !== cls)
    ele.className = brr.join(' ')
}
function addCls (ele, cls) {
    ele.className += ' ' + cls
}
function isLeapYear (n) {
    if (n % 100 === 0 ? n % 400 === 0 : n % 4 === 0) {
        return true
    } else {
        false
    }
}
function run (ele, index) {
    var arr = [].slice.call(ele.getElementsByClassName('miki-datetime-item'))
    arr.forEach(function (e, i) {
        if (+e.innerHTML === index) {
            ele.style.top = ele.offsetTop + (-36 * i) + 'px'
        }
    })
}
function moveTo (ele, start, end) {
    ele.style.transition = 'top 0.3s'
    ele.style.top = end + 'px'
}

//DateTime
function DateTime () {}
DateTime.prototype.init = function (opt) {
    this.ele = opt.ele
    this.cb = opt.cb || ''
    if (this.ele.nodeName !== 'INPUT') throw new Error('元素类型错误')
    this.create(opt)
    this.bindEvent()
}

DateTime.prototype.create = function () {

    var matte = document.createElement('div')
    matte.className = 'miki-matte'
    var container = document.createElement('div')
    container.className = 'miki-datetime'
    var cancel = opt.cancel || '取消'
    var confirm = opt.confirm || '确定'
    var year = opt.year || [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029]
    //获取input框的值
    var val = this.ele.value
    var y = year[0]
    var m = 1
    var d = 1
    var c = 0
    var minute = 0
    var res
    var pattern = /(\d{4})\/(\d{1,2})\/(\d{1,2})\s(\d{1,2}):(\d{1,2})/
    if (pattern.test(val)) {
        res = val.match(pattern)
        y = +res[1]
        m = +res[2]
        d = +res[3]
        c = +res[4]
        minute = +res[5]
    }
    var str = `<div class="miki-datetime-button">
        <div class="miki-datetime-btn miki-datetime-btn-cancel" cancel>${cancel}</div>
        <div class="miki-datetime-btn miki-datetime-btn-confirm" confirm>${confirm}</div>
    </div>`
    str += `<div class="miki-datetime-content">
    <div class="miki-datetime-list year">`
    for (var i = 0;i < year.length; i++) {
        if (year[i] === y) {
            str += ` <div class="miki-datetime-item miki-datetime-active">${year[i]}</div>`
        } else {
            str += ` <div class="miki-datetime-item">${year[i]}</div>`
        }
        if (i === year.length - 1) str += '</div>'
    }
    str += '<div class="miki-datetime-list month">'
    for (var i = 1;i <= 12; i++) {
        if (i === m) {
            str += ` <div class="miki-datetime-item miki-datetime-active">${i}</div>`
        } else {
            str += ` <div class="miki-datetime-item">${i}</div>`
        }
        if (i === 12) str += '</div>'
    }
    str += '<div class="miki-datetime-list day">'
    for (var i = 1;i <= 31; i++) {
        if (i === d) {
            str += ` <div class="miki-datetime-item miki-datetime-active">${i}</div>`
        } else {
            str += ` <div class="miki-datetime-item">${i}</div>`
        }
        if (i === 31) str += '</div>'
    }
    str += '<div class="miki-datetime-list clock">'
    for (var i = 0;i <= 23; i++) {
        if (i === c) {
            str += ` <div class="miki-datetime-item miki-datetime-active">${i}</div>`
        } else {
            str += ` <div class="miki-datetime-item">${i}</div>`
        }
        if (i === 23) str += '</div>'
    }
    str += '<div class="miki-datetime-list minute">'
    for (var i = 0;i <= 59; i++) {
        if (i === minute) {
            str += ` <div class="miki-datetime-item miki-datetime-active">${i}</div>`
        } else {
            str += ` <div class="miki-datetime-item">${i}</div>`
        }
        if (i === 59) str += '</div>'
    }
    str += '<div class="miki-datetime-center"></div>'
    str += '</div>'
    container.innerHTML = str
    container.oncontextmenu = function () {return false}
    container.onselectstart = function () {return false}
    document.body.appendChild(container)
    document.body.appendChild(matte)
    move.easeOut([0,200], function (x) {
        container.style.height = x + 'px'
    })
    move.easeOut([0,0.5], function (x) {
        matte.style.opacity = x
    })

    //初始化日历
    var listYear = document.getElementsByClassName('miki-datetime-list year')[0]
    var listMonth = document.getElementsByClassName('miki-datetime-list month')[0]
    var listDay = document.getElementsByClassName('miki-datetime-list day')[0]
    var listClock = document.getElementsByClassName('miki-datetime-list clock')[0]
    var listMinute = document.getElementsByClassName('miki-datetime-list minute')[0]
    run(listYear, y)
    run(listMonth, m)
    run(listDay, d)
    run(listClock, c)
    run(listMinute, minute)

}
DateTime.prototype.bindEvent = function () {
    var that = this
    var nonleapYear = [31,28,31,30,31,30,31,31,30,31,30,31]     //平年
    var leapYear = [31,29,31,30,31,30,31,31,30,31,30,31]	    //闰年
    var d = 72
    var container = document.getElementsByClassName('miki-datetime')[0]
    var matte = document.getElementsByClassName('miki-matte')[0]
    var content = document.getElementsByClassName('miki-datetime-content')[0]
    var day = document.getElementsByClassName('miki-datetime-list day')[0]
    container.ontouchstart = function (ev) {
        // window.addEventListener('touchmove', function (ev) {
        //     ev.preventDefault()
        // }, {passive: false})
        window.ontouchmove = function () {return false}
        var target = ev.target
        while (target) {
            if (hasCls(target, 'miki-datetime-list')) break
            target = target.parentNode
            if (target.nodeType !== 1) return
        }
        if (!hasCls(target, 'miki-datetime-list')) return
        target.style.transition = ''
        var arr = [].slice.call(target.getElementsByClassName('miki-datetime-item'))
        var y = ev.changedTouches[0].pageY
        var top = pos(content).top
        var targetT = target.offsetTop
        
        container.ontouchmove = function (ev) {
            var dy = ev.changedTouches[0].pageY - y
            target.style.top = targetT + dy + 'px'
        }
        container.ontouchend = function (ev) {
            container.ontouchend = null
            container.ontouchmove = null
            container.ontouchleave = null

            var year = document.getElementsByClassName('miki-datetime-list year')[0]
            var month = document.getElementsByClassName('miki-datetime-list month')[0]
            var day = document.getElementsByClassName('miki-datetime-list day')[0]
            var dayActive = +day.getElementsByClassName('miki-datetime-active')[0].innerHTML
            var t = target.offsetTop
            var sy = ev.changedTouches[0].pageY - y
            var h = target.offsetHeight
            var half = content.offsetHeight / 2
            var base = 36
            var halfBase = base / 2 
            var r
            var n
            if (sy === 0) return
            if (sy < 0) {
                base = -36
                halfBase = -18
            }
            if (t <= -(h - half)) {
                moveTo(target, t, -h + half - halfBase)
                arr.forEach(function (e) {
                    removeCls(e, 'miki-datetime-active')
                })
                addCls(arr[arr.length - 1], 'miki-datetime-active')
                if (hasCls(target, 'year') || hasCls(target, 'month')) {
                    day.innerHTML = ''
                    for (var i = 1; i <= 31; i++) {
                        var item = document.createElement('div')
                        item.className = 'miki-datetime-item'
                        if (i === dayActive) {
                            addCls(item, 'miki-datetime-active')
                        }
                        item.innerHTML = i
                        day.appendChild(item)
                    }
                }
                return
            } 
            if (t >= half) {
                moveTo(target, t, half - halfBase)
                arr.forEach(function (e) {
                    removeCls(e, 'miki-datetime-active')
                })
                addCls(arr[0], 'miki-datetime-active')
                if (hasCls(target, 'year') || hasCls(target, 'month')) {
                    day.innerHTML = ''
                    for (var i = 1; i <= 31; i++) {
                        var item = document.createElement('div')
                        item.className = 'miki-datetime-item'
                        if (i === dayActive) {
                            addCls(item, 'miki-datetime-active')
                        }
                        item.innerHTML = i
                        day.appendChild(item)
                    }
                }
                return
            } 
            r = sy % base
            if (Math.abs(r) >= Math.abs(halfBase)) {
                n = Math.ceil(sy / base) 
            } else {
                n = Math.floor(sy / base)
            }
            moveTo(target, t, n * base + targetT)
            arr.forEach(function (e) {
                removeCls(e, 'miki-datetime-active')
                if (-e.offsetTop ===  n * base + targetT - d) addCls(e, 'miki-datetime-active')
            })
            var start = day.offsetTop
            var end
            var yearArr = [].slice.call(year.getElementsByClassName('miki-datetime-item'))
            var monthArr = [].slice.call(month.getElementsByClassName('miki-datetime-item'))
            var yearItem = yearArr.find(function (e) {
                return hasCls(e, 'miki-datetime-active')
            })
            var monthItem = monthArr.find(function (e) {
                return hasCls(e, 'miki-datetime-active')
            })
            var dayNum
            var dayArr
            if (hasCls(target, 'year') || hasCls(target, 'month')) {
                day.innerHTML = ''
                if (isLeapYear(+yearItem.innerHTML)) {
                    dayNum = leapYear[+monthItem.innerHTML - 1]
                } else {
                    dayNum = nonleapYear[+monthItem.innerHTML - 1]
                }
                var mark = Math.min(dayNum, dayActive)
                for (var i = 1; i <= dayNum; i++) {
                    var item = document.createElement('div')
                    item.className = 'miki-datetime-item'
                    if (i === mark) {
                        addCls(item, 'miki-datetime-active')
                    }
                    item.innerHTML = i
                    day.appendChild(item)
                }
                end = -(mark * Math.abs(base) - half - Math.abs(halfBase))
                dayArr = [].slice.call(day.getElementsByClassName('miki-datetime-item'))
                if (dayActive <= dayNum) return
                moveTo (day, start, end)
            }
        }
        container.ontouchleave = function () {
            container.ontouchend = null
            container.ontouchmove = null
            container.ontouchleave = null
            moveTo (target, targetT, d)
        }
    }
    document.getElementsByClassName('miki-datetime-btn-cancel')[0].onclick = function () {
        move.easeOut([200, 0], function (x) {
            container.style.height = x + 'px'
            if (x === 0) {
                container.remove()
            }
        })
        move.easeOut([0.5, 0], function (x) {
            matte.style.opacity = x
            if (x === 0) {
                matte.remove()
            }
        })
    }
    document.getElementsByClassName('miki-datetime-btn-confirm')[0].onclick = function () {
        var arr = [].slice.call(document.getElementsByClassName('miki-datetime-active'))
        var str = ''
        str += (arr[0]).innerHTML + '/' + arr[1].innerHTML + '/' + arr[2].innerHTML + ' ' + arr[3].innerHTML + ':' + arr[4].innerHTML
        that.ele.value = str
        new Promise(function (r, j) {
            that.cb && that.cb(r, j) || r(1)
        }).then(function (res) {
            move.easeOut([200, 0], function (x) {
                container.style.height = x + 'px'
                if (x === 0) {
                    container.remove()
                }
            })
            move.easeOut([0.5, 0], function (x) {
                matte.style.opacity = x
                if (x === 0) {
                    matte.remove()
                }
            })
        }).catch(function (error) {
            move.easeOut([200, 0], function (x) {
                container.style.height = x + 'px'
                if (x === 0) {
                    container.remove()
                }
            })
            move.easeOut([0.5, 0], function (x) {
                matte.style.opacity = x
                if (x === 0) {
                    matte.remove()
                }
            })
        })
    }
    document.getElementsByClassName('miki-matte')[0].onclick = function () {
        move.easeOut([200, 0], function (x) {
            container.style.height = x + 'px'
            if (x === 0) {
                container.remove()
            }
        })
        move.easeOut([0.5, 0], function (x) {
            matte.style.opacity = x
            if (x === 0) {
                matte.remove()
            }
        })
    }
} 