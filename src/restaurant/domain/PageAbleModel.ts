export default class PageAbleModel<T>{
     constructor(
        public pageNo: number,
        public limit: number,
        public totalPages: number,
        public data: T[],
     ){}
}