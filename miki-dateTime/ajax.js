function ajax (opt) {
	if (!opt.url) {
		throw new Error('missing opt.url');
	}


	var xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function () {
		if (+xhr.readyState === 4) {
			if (+xhr.status === 200) {
				var res;
				var str = xhr.responseText;
				try {
					res = JSON.parse(str);
				} catch (e) {
					res = str;
				}
				opt.success && opt.success(res);
			} else {
				opt.error && opt.error();
			}
		}
	}

	var method;
	if (['GET', 'POST', 'PUT', 'DELETE'].indexOf(opt.method) > -1) {
		method = opt.method;
	} else {
		method = 'GET';
	}

	var url = opt.url;
	opt.params && (url += getQueryString(opt.params));

	xhr.open(method, url);

	if (opt.header) {
		for (var k in opt.header) {
			xhr.setRequestHeader(k, opt.header[k]);
		}
	}

	var types = [
		'application/json',
		'application/x-www-form-urlencoded'
	];

	switch (opt.contentType) {
		case types[0]:
			xhr.setRequestHeader('Content-Type', types[0] + '; charset=UTF-8');
			xhr.send(JSON.stringify(opt.data || {}));
			break;

		case types[1]:
		default:
			xhr.setRequestHeader('Content-Type', types[1] + '; charset=UTF-8');
			xhr.send(serialize(opt.data));
	}

}


var toStr = Object.prototype.toString;
function isObj (obj) {
	return toStr.call(obj) === '[object Object]';
}

function isArr (arr) {
	return toStr.call(arr) === '[object Array]';
}

function getQueryString (params) {
	if (!isObj(params)) return '';
	var res = [];
	for (var k in params) {
		res.push(k + '=' + params[k]);
	}
	return res.length ? '?' + res.join('&') : '';
}

function serialize (data) {
	if (!isObj(data)) return;
	var res = [];
	for (var k in data) {
		res.push(encodeURIComponent(k) + '=' + encodeURIComponent(data[k]));
	}
	return res.join('&');
}
