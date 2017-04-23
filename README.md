## Table component with VanillaJS [DEMO](https://fagarbal.github.io/pyrite-table/)

### Installation

- NPM

``` bash
npm install pyrite-table
```

- Single-file [DOWNLOAD](https://raw.githubusercontent.com/fagarbal/pyrite-table/master/build/pyrite-table.min.js)

```html
<script src="pyrite-table.min.js"></script>
```

### Usage [EXAMPLES](https://github.com/fagarbal/pyrite-table/tree/master/examples)

- ES6

``` javascript
import Table from 'pyrite-table';

const config = { ... };
const model = [{ ... }, ... ];

Table.load(config, model);
```

- CommonJS

``` javascript
const Table = require('pyrite-table');

const config = { ... };
const model = [{ ... }, ... ];

Table.load(config, model);
```

- Single-file


``` javascript
var config = { ... };
var model = [{ ... }, ... ];

pyrite.Table.load(config, model);
```

### Config

``` javascript
{
	table: "id-table",

	fields: [{
		title: "Col Title",
		field: "property.in.model", // Optional if there is a custom template.
		id: "id-for-filtering", // Use only when has a field value.
		autorefresh: Number, // Optional: Number of miliseconds.
		template: (row) => { // Optional: Custom template function.
			return `<a href="mailto:${row.field_name}">${row.field_name}</a>`;
		},
		order: (a, b) => { // Optional: Custom order function or disabled if is equal to false.
			if (a.field_name > b.field_name) return 1;
			else if (a.field_name < b.field_name) return -1;
			return 0;
		}
	}, ... ],

	search: {
		id: "id-for-global-search",
		fields: ["property.in.model", "another.property", ... ] // Optional: By default all fields.
	},

	text: {
		total: "id-total-text",
		filter: "id-filter-text"
	},

	pagination: {
		id: "id-pagination",
		limit: Number // Number of results per page.
	}
}
```

### Model
``` javascript
[{
	"name": "Pepe",
	"lastname": "Garcia",
	"age": 21,
	"city": "Gijon"
}, {
	"name": "Jose",
	"lastname": "Alonso",
	"age": 12,
	"city": "Oviedo"
}, {
	"name": "Maria",
	"lastname": "Fernandez",
	"age": 22,
	"city": "Aviles"
}, {
	"name": "Pepa",
	"lastname": "Rodriguez",
	"age": 33,
	"city": "Loroñe"
}, ... ]
```
