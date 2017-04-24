import utils from './utils.js';

export default class TableDom {
	constructor(config) {
		this.config = config;

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
			fields: {}
		};

		if (config.search && config.search.id) {
			elements.search = {
				input: document.getElementById('input-' + config.search.id),
				button: document.getElementById('button-' + config.search.id)
			};
		}

		if (config.pagination && config.pagination.id) {
			elements.pagination = {
				box: document.getElementById(config.pagination.id),
				first: document.getElementById(config.pagination.id + '-first'),
				previous: document.getElementById(config.pagination.id + '-previous'),
				next: document.getElementById(config.pagination.id + '-next'),
				current: document.getElementById(config.pagination.id + '-current'),
				total: document.getElementById(config.pagination.id + '-total'),
				last: document.getElementById(config.pagination.id + '-last'),
				select: document.getElementById(config.pagination.id + '-select')
			};
		}

		if (config.loading) elements.loading = document.getElementById(config.loading);

		if (config.text && config.text.id) {
			elements.text = {
				box: document.getElementById(config.text.id),
				total: document.getElementById(config.text.id + '-total'),
				filter: document.getElementById(config.text.id + '-filter')
			};
		}

		config.fields.forEach((field) => {
			elements.fields[field.field] = {
				input: document.getElementById('input-' + field.id),
				button: document.getElementById('button-' + field.id)
			};
		});

		return elements;
	}

	clean() {
		if (this.elements.loading) this.elements.loading.hidden = false;
		this.elements.table.innerHTML = '';
	}

	draw(controller) {
		this.clean();
		if (!this.hasEvents) this.__addEvents(controller);
		if (this.config.pagination) this.__drawPagination(controller);
		this.__drawHeaders(controller);
		this.__drawBody(controller);
		this.__drawText(controller);
	}

	__addEvents(controller) {
		this.hasEvents = true;
		this.__setSimpleSearch(controller);
		this.__setAdvancedSearch(controller);
		this.__setPagination(controller);
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

	__drawPagination(controller) {
		const paginationElements = this.elements.pagination;

		paginationElements.current.innerText = controller.currentPage;
		paginationElements.total.innerText = controller.totalPages;

		paginationElements.previous.disabled = paginationElements.first.disabled = controller.currentPage <= 1;
		paginationElements.next.disabled = paginationElements.last.disabled = controller.currentPage >= controller.totalPages;
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

		let model = controller.filter || controller.model;

		if (this.config.pagination) {
			const page = controller.currentPage === 0 ? 1 : controller.currentPage;

			model = model.slice((page - 1) * this.config.pagination.limit, page * this.config.pagination.limit);

			if (controller.currentPage === 0) controller.currentPage = 1;
		}

		model.forEach((row) => {
			const tr = document.createElement('tr');

			controller.fields.forEach((col) => {
				this.__drawCol(tr, row, col);
			});

			body.appendChild(tr);
		});

		this.elements.table.appendChild(body);

		if (this.elements.loading) this.elements.loading.hidden = true;
		if (this.elements.text) this.elements.text.box.hidden = false;
		if (this.elements.pagination) this.elements.pagination.box.hidden = false;
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

	__setPagination(controller) {
		if (this.config.pagination) {
			const paginationEvent = (element, callback) => {
				if (element) {
					element.addEventListener('click', () => {
						callback();
						controller.reload(controller.filter || controller.model);
					});
				}
			};

			paginationEvent(this.elements.pagination.previous, () => controller.currentPage--);
			paginationEvent(this.elements.pagination.next, () => controller.currentPage++);
			paginationEvent(this.elements.pagination.first, () => controller.currentPage = 1);
			paginationEvent(this.elements.pagination.last, () => controller.currentPage = controller.totalPages);

			if (this.elements.pagination.select) {
				this.elements.pagination.select.addEventListener('change', (event) => {
					this.config.pagination.limit = parseInt(event.target.value);
					controller.reload(controller.filter || controller.model);
				})
			}
		}
	}
}