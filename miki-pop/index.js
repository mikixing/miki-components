/**
 * @author mikixing
 * [Dialog description]
 * @param {Object} opt [description]
 */
function MikiPop () {}
MikiPop.prototype.dialog = function (opt = {}) {
	let title = opt.title || '温馨提示'
	let content = opt.content || ''
	let fns = opt.fns
	let fnf = opt.fnf

	let tpl = `<div class="miki-pop" id="my-dialog">
					<div class="miki-title">${title}</div>
					<div class="miki-text">${content}</div>
					<div class="miki-btn fit">
						<div class="miki-cancel" cancel>取消</div>
						<div class="miki-confirm" confirm>确定</div>
					</div>
				</div>`
	let matte = `<div class="miki-matte" id="my-matte"></div>`
	let $tpl = $(tpl)
	let $matte = $(matte)
	
	//判断当前的document下是否存在my-dialog,删除已经存在的dialog
	if ($('#my-dialog')) {
		$('#my-dialog').remove()
	}
	if ($('#my-matte')) {
		$('#my-matte').remove()
	}
	$(document.body).append($matte)
	$(document.body).append($tpl)
	$tpl.on('click', '[confirm]', function (ev) {
		$tpl.animate({top: 0}, function () {
			new Promise((r, j) => {
				if (fns && typeof fns === 'function') {
					fns(r, j)
				} else {
					r(1)
				}
			}).then(val => {
				$tpl.remove()
				$matte.remove()
			}).catch(e => {
				$tpl.remove()
				$matte.remove()
			})
		})
	})
	$tpl.on('click', '[cancel]', function (ev) {
		$tpl.animate({top: 0}, function () {
			new Promise((r, j) => {
				if (fnf && typeof fnf === 'function') {
					fnf(r, j)
				} else {
					r(1)
				}
			}).then(val => {
				$tpl.remove()
				$matte.remove()
			}).catch(e => {
				$tpl.remove()
				$matte.remove()
			})
		})
	})
	$('.miki-pop').animate({top: '10%'})
	$matte.animate({backgroundColor: 'rgba(0, 0, 0, .5)'})
}
MikiPop.prototype.alert = function (opt = {}) {
	let title = opt.title || '温馨提示'
	let content = opt.content || ''

	let tpl = `<div class="miki-pop" id="my-alert">
					<div class="miki-title">${title}</div>
					<div class="miki-text">${content}</div>
					<div class="miki-btn fit">
						<div class="miki-confirm" confirm>ok</div>
					</div>
				</div>`
	let matte = `<div class="miki-matte" id="my-matte"></div>`
	let $tpl = $(tpl)
	let $matte = $(matte)
	
	//删除已经存在的alert
	if ($('#my-alert')) {
		$('#my-alert').remove()
	}
	if ($('#my-matte')) {
		$('#my-matte').remove()
	}
	$(document.body).append($matte)
	$(document.body).append($tpl)
	$tpl.on('click', '[confirm]', function (ev) {
		$tpl.animate({top: 0}, function () {
			$tpl.remove()
			$matte.remove()
		})
	})
	$('.miki-pop').animate({top: '10%'})
	$matte.animate({backgroundColor: 'rgba(0, 0, 0, .5)'})
}

