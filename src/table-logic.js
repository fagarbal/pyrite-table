import utils from './utils.js';

export default class Table {
	constructor(config, model) {
		this.config = config;
		this.fields = config.fields;
		this.model = model;

		this.orderField = {};
	}

	load(callback) {
		this.render = callback;
		this.render(this);

		return this;
	}

	reload(body = null) {
		this.filter = body;
		this.render(this);
	}

	simpleSearch(searchText) {
		const searchValue = utils.transformString(searchText);

		if (this.config.search && this.config.search.fields && !this.searchFields) {
			this.searchFields = this.fields.filter((field) => this.config.search.fields.includes(field.id));
		}

		const searchFilter = this.model.filter((row) => {
			return (this.searchFields || this.fields).some((field) => {
				const rowValue = utils.transformString(utils.getPropertyByString(row, field.field));

				return rowValue.indexOf(searchValue) >= 0;
			});
		})

		this.reload(searchFilter);
	}

	advancedSearch(elements) {
		let advancedFilter = this.model;

		this.fields.forEach((field) => {
			const element = elements[field.field];

			if (!element || !element.input) return;

			const search = utils.transformString(element.input.value);

			advancedFilter = advancedFilter.filter((row) => {
				const elementValue = utils.transformString(utils.getPropertyByString(row, field.field));

				return elementValue.indexOf(search) >= 0;
			})
		});

		this.reload(advancedFilter);
	}

	order(field) {
		let greater = 1;
		let less = -1;

		if (this.orderField[field] === 'asc') {
			greater = -1;
			less = 1;
			this.orderField = {};
			this.orderField[field] = 'desc';
		} else {
			this.orderField = {};
			this.orderField[field] = 'asc';
		}

		const ordered = (this.filter || this.model).sort((a , b) => {
			const valueA = utils.getPropertyByString(a, field);
			const valueB = utils.getPropertyByString(b, field);

			if (valueA > valueB) return greater;
			else if (valueA < valueB) return less;
			return 0;
		});

		this.reload(ordered);
	}
}