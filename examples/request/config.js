export default {
	table: "table-example",

	fields: [{
		title: "Username",
		field: "login.username",
		id: "username"
	}, {
		title: "Name",
		field: "name.first",
		id: "name"
	}, {
		title: "Last Name",
		field: "name.last",
		id: "lastname"
	}, {
		title: "Street",
		field: "location.street",
		id: "street",
		order: false
	}, {
		title: "Full Name",
		template(row) {
			return `${row.name.first} ${row.name.last}`;
		},
		order(a, b) {
			const fullNameA = `${a.name.first} ${a.name.last}`;
			const fullNameB = `${b.name.first} ${b.name.last}`;

			if (fullNameA > fullNameB) return 1;
			else if (fullNameA < fullNameB) return -1;
			return 0;
		}
	}, {
		title: "Email",
		field: "email",
		template(row) {
			return `<a href="mailto:${row.email}">${row.email}<a>`;
		}
	}],

	search: {
		id: "search",
		fields: ["login.username", "name.first", "name.last"]
	},

	text: {
		total: "total-text",
		filter: "filter-text"
	},

	pagination: {
		id: "pagination",
		limit: 10
	}
};