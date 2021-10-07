/**
 * @namespace page
 */

/**
 * Interface for control the pages structure.
 * @interface 
 * @field free -  For know if the page is free.
 * @field page - The page information.
 */
export interface IPage {
    free : boolean;
    page : Page;
}

export class Page {
    page_number     : number;
    process_pid     : string;
    process_page    : number;

    /**
     * Creates an instance of Page.
     * @param page_number - The number of page in memory.
     * @param size - The size of the page.
     * @param unit - The unit of the page.
     * @param pid - The PID of the process that page contains.
     * @param page - The page of the process that page contains.
     */
    constructor(page_number : number, size : number, unit : string, pid : string, page : number){
        this.page_number    = page_number;
        this.process_pid    = pid;
        this.process_page   = page;
    }

}