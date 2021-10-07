import { Page, IPage } from "./page";
import Process from "./process";

/** Class representing the virtual memory
 */
export default class VirtualMemory {

    size    : number;
    unit    : string;
    offset  : number;
    pages   : IPage[];
    free_p  : number;

    /**
     * Create a instance of virtual_memory
     * @param {number} page_size - the size of all pages
     * @param number_of_pages - the total number of pages
     * @param unit - the unit of all pages.
     */
    constructor(page_size : number, number_of_pages : number, unit : string){
        this.size       = page_size * number_of_pages;
        this.unit       = unit;
        this.pages      = [];
        this.free_p     = number_of_pages;
        this.initPages();
    }

    /**
     * Start each page state as blank page and free for use.
     */
    private initPages() : void {
        for(let i = 0; i < this.free_p; i++){
            this.pages[i] = {
                free : true,
                page : null
            };
        }
    }

    /**
     * Try to load a process depends on free pages.
     * @param process - the process to be loaded
     * @returns {boolean} false if the process cannot be loaded, true otherwise
     */
    public loadProcess(process : Process) : boolean {
        if(process.number_of_pages > this.free_p) return false;
        let process_pages = 0;
        for(let i = 0; i < this.pages.length; i++){
            if(process_pages === process.number_of_pages) break;
            if(this.pages[i].free){
                this.pages[i].page = new Page(i, 4, 'kb', process.PID, process_pages++);
                this.pages[i].free = false;
            }
        }
        return true;
    }

    /**
     * Returns true if the virtual memory is full, flase otherwise
     */
    public isFull() : boolean { return this.free_p === 0; }

    /**
     * Delete all process pages from virtual memory
     * @param {string} pid - The PID of the process to be deleted.
     */
    public deleteProcess(pid: string): void {
        for(let i = 0; i < this.pages.length; i++)
            if(!this.pages[i].free)
                if(this.pages[i].page.process_pid === pid)
                    this.pages[i] = {free : true, page : null};
    }

    /**
     * Check if the process is loaded in virtual memory
     * @param pid
     * @returns true if the process is in virtual memory, false otherwise
     */
    public hasProcess(pid : string) : boolean {
        for(let i = 0; i < this.pages.length; i++)
            if(!this.pages[i].free)
                if(this.pages[i].page.process_pid === pid) return true;
        return false;
    }

    public toString() : string {
        let cad = "";
        this.pages.map(x => {
            if(x.free)
                cad += " # |"
            else
                cad += x.page.process_pid + "-" + x.page.process_page + ' |';
        });
        return cad;
    }

}