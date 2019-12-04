export class Coordinate{

	lat: number;
	lng: number;
	
	constructor(object?: {}) {
		for (var key in object) {
			this[key] = object[key];
		}
	}
}