export interface IPage {
    free : boolean;
    page : Page;
}

export class Page {
    page_number     : number;
    present_bit     : boolean;
    modified_bit    : boolean;
    time_used       : number;
    size            : number;
    unit            : string;

    process_pid     : string;
    process_page    : number;

    constructor(page_number : number, size : number, unit : string, pid : string, page : number){
        this.page_number    = page_number;
        this.present_bit    = false;
        this.modified_bit   = false;
        this.time_used      = 0;
        this.size           = size;
        this.unit           = unit;

        this.process_pid    = pid;
        this.process_page   = page;
    }
}   