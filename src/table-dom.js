export default class TableDom {
	constructor() {
		this.iconMapper = {
			asc: 'fa-sort-asc',
			desc: 'fa-sort-desc',
		};
	}

	cleanAndLoad() {
		this.element = document.getElementById(this.id);
		this.element.innerHTML = '';
	}

	draw(body) {
		this.cleanAndLoad();
		this.drawHeaders();
		this.drawBody(body);

		if (this.totalText) this.drawResultText(body);
	}

	drawResultText(filterResult) {
		this.totalText.innerText = this.rows.length;
		this.filterText.innerText = filterResult.length;
	}

	drawCol(parent, value, type = 'td') {
		const td = document.createElement(type);

		td.innerText = value;

		parent.appendChild(td);
	}

	getDescendantProp(obj, desc) {
	    var arr = desc.split('.');
	    while(arr.length && (obj = obj[arr.shift()]));
	    return obj;
	}

	drawHeaders() {
		const header = document.createElement('thead');
		const tr = document.createElement('tr');

		Object.keys(this.fields).forEach((field) => {
			const th = document.createElement('th');

			const anchor = document.createElement('a');
			const icon = document.createElement('i');

			icon.className = `fa `;
			icon.style.marginLeft = '5px';

			const faIcon = this.iconMapper[this.currentOrder[field]];
			if (faIcon) icon.className += faIcon;
			else icon.className += 'fa-sort';

			anchor.innerText = this.fields[field];
			anchor.href = 'javascript:void(0)';

			anchor.addEventListener('click', this.order.bind(this, field));

			anchor.appendChild(icon);

			th.appendChild(anchor);
			tr.appendChild(th);
		});

		header.appendChild(tr);
		this.element.appendChild(header);
	}

	drawBody(rows) {
		const body = document.createElement('tbody');

		rows.forEach((row) => {
			const tr = document.createElement('tr');

			Object.keys(this.fields).forEach((col) => {
				this.drawCol(tr, this.getDescendantProp(row, col));
			});

			body.appendChild(tr);
		});

		this.element.appendChild(body);
	}

	setSearch(inputId, buttonId) {
		this.searchElement = document.getElementById(inputId);
		this.buttonElement = document.getElementById(buttonId);

		this.buttonElement.addEventListener('click', (event) => {
			this.search(this.searchElement.value);
		});
	}

	setAdvancedSearch(button, searchs) {
		const advancedButtons = document.getElementsByClassName(button);

		this.advancedElements = {};

		Object.keys(searchs).forEach((search, index) => {
			this.advancedElements[search] = document.getElementById(searchs[search]);
			advancedButtons[index].addEventListener('click', this.advancedSearch.bind(this))
		});
	}

	setResultText(totalId, filterId) {
		this.totalText = document.getElementById(totalId);
		this.filterText = document.getElementById(filterId);
	}
}