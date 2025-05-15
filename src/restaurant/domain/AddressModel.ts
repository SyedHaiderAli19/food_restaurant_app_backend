export default class AddressModel{
    constructor(
        public readonly street: string,
        public readonly city: string,
        public readonly parish: string,
        public readonly zone: string,
    ){}
}