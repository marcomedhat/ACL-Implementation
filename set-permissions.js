import {roles} from './roles-model.js';

export function an(role) {

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