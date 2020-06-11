import {roles} from './roles-model.js';

export class check {
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