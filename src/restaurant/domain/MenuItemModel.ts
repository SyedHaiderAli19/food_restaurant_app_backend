export default class MenuItemModel {
  constructor(
    public readonly id: string,
    public readonly menuId: string,
    public readonly description: string,
    public readonly imageUrl: string[],
    public readonly name: string,
    public readonly unitPrice: number
  ) {}
}
