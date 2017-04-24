import TableLogic from './table-logic';
import TableDom from './table-dom';

class Table {
	static load(config, model) {
		if (!config) throw new Error('Argument 1 is missing: configuration json');
		if (!model) throw new Error('Argument 2 is missing: array model');

		const tableLogic = new TableLogic(config);

		const loadTable = (result) => {
			tableLogic.setModel(result);
			const tableDom = new TableDom(config);

			tableLogic.load(tableDom.draw.bind(tableDom));
		}

		const onLoad = () => {
			if (typeof model.then === 'function') {
				model.then(loadTable);
			} else {
				loadTable(model);
			}

			window.removeEventListener('DOMContentLoaded', onLoad);
		};

		window.addEventListener('DOMContentLoaded', onLoad);

		if (document.readyState === "complete") onLoad();

		return tableLogic;
	}
};

if (!window.pyrite) window.pyrite = {};

export default module.exports = window.pyrite.Table = Table;
