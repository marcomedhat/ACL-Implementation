const roles = {};

// CREATE ROLES
class acl {
  static createRole(role) {
    if(!roles[role] && typeof role === 'string') {
        roles[role] = {};
    }
    return roles;
  }
}
// acl.createRole('admin');
// acl.createRole('user');
// acl.createRole('guest');


// CREATE PERMISSIONS
function an(role) {

	let HttpVerb;

	if (typeof role !== 'string') {
		return;
	}

	if (roles[role] === undefined) {
		throw new TypeError('This role does not exist, please create it first');
	}

	// SET PERMISSIONS
	function can(HTTP_VERB) {
		if (typeof HTTP_VERB !== 'string') {
			return;
		}

		HttpVerb = HTTP_VERB;

		if (!roles[role].rules) {
			roles[role].rules = [];
		}

		let notExistingRule = true;

		if (roles[role].rules.length > 0) {
			roles[role].rules.forEach(rule => {
				if (rule[HTTP_VERB] === HTTP_VERB) {	
					notExistingRule = false;
				} else {
					notExistingRule = true;
				}
				return notExistingRule;
			});
		}

		if(notExistingRule) {
			roles[role].rules.push({[`${HTTP_VERB}`]: HTTP_VERB});
		}
		return this;
	}

	// SET ENDPOINT
	function to(endpoint) {
		if (typeof endpoint !== 'string') {
			return;
		}

		let filteredRules = roles[role].rules.filter(rule => {
			return rule[HttpVerb] === HttpVerb;
		});

		if (filteredRules.length > 0) {
			filteredRules[0].url = endpoint;
		}

		return this;
	}

	// SET CONDITION
	function when(params) {
		if (typeof params !== 'object') {
			return;
		}

			let rule = roles[role].rules.filter(rule => {
				return rule[HttpVerb] === HttpVerb;
			});

			rule[0].condition = params;

		return this;
	}

	return {
		can, 
		to,
		from: to,
		when
	};
}

// an('admin').can('get').from('/users');
// an('admin').can('post').to('/users');
// an('user').can('post').to('/users/:userId/articles').when({userId: 10});
// an('guest').can('get').from('/articles');


// CHECK PERMISIONS
class check {
	constructor() {
		this.check = true;
	}
		
	static if(role) {
		let HttpVerb;

		if (!roles[role]) {
			throw new TypeError('This role does not exist');
		}

		function can(HTTP_VERB) {
			if (typeof HTTP_VERB !== 'string') {
				this.check = false;
			}

			HttpVerb = HTTP_VERB;

			if (!roles[role].rules) {
				this.check = false;
			} else {
				let filteredRules = roles[role].rules.filter(rule => {
					return rule.hasOwnProperty(HTTP_VERB);
				});

				if (filteredRules.length > 0) {
					this.check = true;
				} else {
					this.check = false;
				}
			}
			return this;
		}

		function to(endpoint) {
			if (this.check == true){
				if (typeof endpoint !== 'string') {
					this.check = false;
				}

				let filteredRules = roles[role].rules.filter(rule => {
					return rule.url === endpoint;
				});

				if (filteredRules.length > 0) {
					this.check = true;
					if(filteredRules[0].condition !== undefined) {
						return this;
					} else {
						return this.check;
					}
				} else {
					this.check = false;
					return this.check;
				}
			}
			return this.check;
		}

		function when(params) {
			if (this.check == true){

				let filteredRules = roles[role].rules.filter(rule => {
					return rule.hasOwnProperty(HttpVerb);
				});

				if (filteredRules.length > 0) {
					let url = filteredRules[0].url;
					let param = url.split("/");
					let parameter = param.filter((item) => {
						return item.startsWith(":");
					});

					let cond = parameter[0].slice(1);

					if (!filteredRules[0].condition.hasOwnProperty(cond)) {
						this.check = false;
					} else {
						if (params[cond] !== filteredRules[0].condition[cond]) {
							this.check = false;
						} else {
							this.check = true;
						}
					}
				}
			}

			return this.check;
		}

		return {
			can,
			to,
			from: to,
			when
		};
	}
}
// check.if('guest').can('post').to('/users');
// check.if('admin').can('post').to('/users');
// check.if('user').can('post').to('/users/:userId/articles').when({userId: 10});