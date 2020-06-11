import {roles} from './roles-model.js';

export class acl {
  static createRole(role) {
    if(!roles[role] && typeof role === 'string') {
        roles[role] = {
					id: Object.keys(roles).length + 1
				};
    }
    return roles;
  }
}