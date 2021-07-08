export interface IPage {
    free : boolean;
    page : Page;
}

export class Page {
    page_number     : number;
    process_pid     : string;
    process_page    : number;

    constructor(page_number : number, size : number, unit : string, pid : string, page : number){
        this.page_number    = page_number;
        this.process_pid    = pid;
        this.process_page   = page;
    }
}   