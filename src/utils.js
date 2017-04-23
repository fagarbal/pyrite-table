class Utils {
	request(url, params = {}) {
		return new Promise((resolve, reject) => {
			const xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = () => {
			    if (xhttp.readyState === 4) {
			    	if (xhttp.status === 200) {
			    		resolve(!params.plain ? JSON.parse(xhttp.responseText) : xhttp.responseText);
				    } else {
				    	reject({
				    		status: xhttp.status,
				    		message: xhttp.responseText
				    	});
				    }
				}
			};

			xhttp.open(params.method || 'GET', url, true);

			xhttp.send();
		});
	}

	getPropertyByString(obj, str) {
	    var arr = str.split('.');
	    while(arr.length && (obj = obj[arr.shift()]));
	    return obj;
	}

	transformString(str) {
		return str.toString().toUpperCase().trim();
	}
}

export default new Utils();