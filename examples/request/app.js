import utils from '~/src/utils.js';
import Table from '~/src/table.js';
import tableConfig from './config.json';

utils.request('https://randomuser.me/api/?results=200&nat=es')
.then((tableObject) => {
	const table = Table.load(tableConfig, tableObject.results);
});
