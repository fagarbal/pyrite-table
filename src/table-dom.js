import utils from './utils.js';

export default class TableDom {
	constructor(config) {
		this.iconMapper = {
			fa: {
				asc: 'fa-sort-asc',
				desc: 'fa-sort-desc'
			}
		};

		this.elements = this.getElements(config);
	}

	getElements(config) {
		const elements = {
			table: document.getElementById(config.table),
			search: {
				input: document.getElementById('input-' + config.search.id),
				button: document.getElementById('button-' + config.search.id)
			},
			text: {
				total: document.getElementById(config.text.total),
				filter: document.getElementById(config.text.filter)
			},
			fields: {}
		};

		config.fields.forEach((field) => {
			elements.fields[field.field] = {
				input: document.getElementById('input-' + field.id),
				button: document.getElementById('button-' + field.id)
			};
		});

		return elements;
	}

	clean() {
		this.elements.table.innerHTML = '';
	}

	draw(controller) {
		this.clean();
		this.__addEvents(controller);
		this.__drawHeaders(controller);
		this.__drawBody(controller);
		this.__drawText(controller);
	}

	__addEvents(controller) {
		this.__setSimpleSearch(controller);
		this.__setAdvancedSearch(controller);
	}

	__drawCol(parent, row, col) {
		const td = document.createElement('td');

		if (col.template) td.innerHTML = col.template(row);
		else td.innerText = utils.getPropertyByString(row, col.field);;

		parent.appendChild(td);
	}

	__drawText(controller) {
		const textElements = this.elements.text;

		if (textElements) {
			if (textElements.total) textElements.total.innerText = controller.model.length;

			if (textElements.filter) {
				const filterText = controller.filter ? controller.filter.length : controller.model.length;

				textElements.filter.innerText = filterText;
			}
		}
	}

	__drawHeaders(controller) {
		const header = document.createElement('thead');
		const tr = document.createElement('tr');

		controller.fields.forEach(this.__drawOrder.bind(this, controller, tr));

		header.appendChild(tr);
		this.elements.table.appendChild(header);
	}

	__drawLink(controller, field, title) {
		title.href = 'javascript:void(0)';

		const icon = document.createElement('i');

		icon.className = `fa `;
		icon.style.marginLeft = '5px';

		const faIcon = this.iconMapper.fa[controller.orderField[field.field]];
		if (faIcon) icon.className += faIcon;
		else icon.className += 'fa-sort';

		title.addEventListener('click', controller.order.bind(controller, field));

		title.appendChild(icon);
	}

	__drawOrder(controller, tr, field) {
		const hasOrder = field.order || (field.field && field.order !== false);
		const th = document.createElement('th');
		const title = document.createElement(hasOrder ? 'a' : 'span');

		title.innerText = field.title;

		if (hasOrder) this.__drawLink(controller, field, title);

		th.appendChild(title);
		tr.appendChild(th);
	}

	__drawBody(controller) {
		const body = document.createElement('tbody');

		const model = controller.filter || controller.model;

		model.forEach((row) => {
			const tr = document.createElement('tr');

			controller.fields.forEach((col) => {
				this.__drawCol(tr, row, col);
			});

			body.appendChild(tr);
		});

		this.elements.table.appendChild(body);
	}

	__setSearchTimeout(controller, method, options, time) {
		clearTimeout(this.searchInProgres);

		this.searchInProgres = setTimeout(method.bind(controller, options), time);
	}

	__setSimpleSearch(controller) {
		if (this.elements.search.input) {
			this.elements.search.input.addEventListener('keypress', (event) => {
				if (event.keyCode === 13) {
					this.__setSearchTimeout(controller, controller.simpleSearch, event.target.value);
				}
			});

			if (this.elements.search.button) {
				this.elements.search.button.addEventListener('click', () => {
					this.__setSearchTimeout(controller, controller.simpleSearch, this.elements.search.input.value);
				});
			}
		}
	}

	__setAdvancedSearch(controller) {
		const inputs = {};

		controller.fields.forEach((field, index) => {
			const element = this.elements.fields[field.field];

			inputs[field.field] = element;

			if (element.input) {
				element.input.addEventListener('keypress', (event) => {
					if (field.autorefresh || event.keyCode === 13) {
						this.__setSearchTimeout(controller, controller.advancedSearch, inputs, field.autorefresh);
					}
				});

				if (element.button) element.button.addEventListener('click', () => {
					this.__setSearchTimeout(controller, controller.advancedSearch, inputs);
				});
			}
		});
	}
}