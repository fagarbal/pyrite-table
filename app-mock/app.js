import utils from '../src/utils.js';

import Table from '../src/table.js';

const fields = {
	name: 'Name',
	lastname: 'Last Name',
	age: 'Age',
	city: 'City'
};

const table = new Table('table-example', fields);

window.addEventListener('DOMContentLoaded', () => {
	utils.request('table.json').then((tableObject) => {
		table.setSearch('input-search', 'button-search');
		table.setAdvancedSearch('advanced-buttom', {
			name: 'advanced-name',
			lastname: 'advanced-lastname',
			age: 'advanced-age',
			city: 'advanced-city'
		});
		table.setResultText('total-text', 'filter-text');

		table.load(tableObject);
	});
});
