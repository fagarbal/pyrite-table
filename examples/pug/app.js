import utils from 'pyrite-table/utils.js';
import Table from 'pyrite-table';
import tableConfig from './config.js';

utils.request('https://randomuser.me/api/?results=200&nat=es')
.then((tableObject) => {
	const table = Table.load(tableConfig, tableObject.results);
});
