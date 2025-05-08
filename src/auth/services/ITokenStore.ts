export default interface ITokenService{
    save(token: string): void
    get(token: string):Promise<string>
}