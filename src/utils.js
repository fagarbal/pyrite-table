class Utils { 
	request(url, params = {}) {
		return new Promise((resolve, reject) => {
			const xhttp = new XMLHttpRequest();

			xhttp.onreadystatechange = () => {
			    if (xhttp.readyState === 4) {
			    	if (xhttp.status >= 200 && xhttp.status < 300) {
			    		resolve(!params.plain ? JSON.parse(xhttp.responseText) : xhttp.responseText);
				    } else if (xhttp.status >= 300) {
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
}

export default new Utils();