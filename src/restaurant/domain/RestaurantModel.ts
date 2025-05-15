import AddressModel from "./AddressModel";
import LocationModel from "./LocationModel";

export default class RestaurantModel{
    constructor( 
        public readonly id: string,
        public readonly name: string,
        public readonly type: string,
        public readonly rating: number,
        public readonly displayImgUrl: string,
        public readonly location: LocationModel,
        public readonly address: AddressModel,
    ){}
}