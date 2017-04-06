import utils from '../src/utils.js';

import Table from '../src/table.js';

const fields = {
	'login.username': 'Username',
	'name.first': 'Name',
	'name.last': 'Last Name',
	'location.street': 'Street'
};

const table = new Table('table-example', fields);

window.addEventListener('DOMContentLoaded', () => {
	utils.request('https://randomuser.me/api/?results=200&nat=es').then((tableObject) => {
		table.setSearch('input-search', 'button-search');
		table.setAdvancedSearch('advanced-buttom', {
			'login.username': 'advanced-username',
			'name.first': 'advanced-name',
			'name.last': 'advanced-lastname',
			'location.street': 'advanced-street'
		});
		table.setResultText('total-text', 'filter-text');

		table.load(tableObject.results);
	});
});
