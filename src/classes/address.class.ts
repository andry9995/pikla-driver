export class Address {

	public id: string;
	public location: any;
	public latitude: number;
	public longitude: number;

	constructor(place: any = null) {
		if (place) {
			this.id = place.id;
			this.location = place.name;
			this.latitude = place.geometry.location.lat();
			this.longitude = place.geometry.location.lng();
		}
	}

	public defined() {
		if (this.location && this.latitude && this.longitude)
			return true;
		else
			return false;
	}
}