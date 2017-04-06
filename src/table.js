import TableDom from './table-dom.js';

export default class Table extends TableDom {
	constructor(id, fields) {
		super();

		this.id = id;
		this.fields = fields;
		this.currentOrder = {};
	}

	load(body) {
		this.rows = body;

		this.reload(body);
	}

	reload(body) {
		this.filterBody = body;

		this.draw(body);
	}

	search(searchText) {
		const searchValue = searchText.toUpperCase();

		const searchBody = this.rows.filter((row) => {
			return Object.keys(this.fields).some((rowKey) => {
				const rowValue = this.getDescendantProp(row, rowKey).toString().toUpperCase();

				return rowValue.indexOf(searchValue) >= 0;
			});
		})

		this.reload(searchBody);
	}

	advancedSearch() {
		let searchBody = this.rows;

		Object.keys(this.advancedElements)
		.forEach((filter) => {
			const search = this.advancedElements[filter].value.toUpperCase();

			searchBody = searchBody.filter((element) => {
				const elementValue = this.getDescendantProp(element, filter).toString().toUpperCase();

				return elementValue.indexOf(search) >= 0;
			})
		});

		this.reload(searchBody);
	}

	order(field) {
		let greater = 1;
		let lesser = -1;

		if (this.currentOrder[field] === 'asc') {
			greater = -1;
			lesser = 1;
			this.currentOrder = {};
			this.currentOrder[field] = 'desc';
		} else {
			this.currentOrder = {};
			this.currentOrder[field] = 'asc';
		}

		const body = this.filterBody.sort((a , b) => {
			if (a[field] > b[field]) return greater;
			else if (a[field] < b[field]) return lesser;
			return 0;
		});

		this.reload(body);
	}
}