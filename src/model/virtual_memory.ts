import { Page, IPage } from "./page";
import Process from "./process";

export default class VirtualMemory {

    size    : number;
    unit    : string;
    offset  : number;
    pages   : IPage[];

    free_p  : number;   

    constructor(page_size : number, number_of_pages : number, unit : string){
        this.size   = page_size * number_of_pages;
        this.unit   = unit;
        this.pages  = [];
        this.free_p = number_of_pages;
        this.initPages();
    }

    private initPages() : void {
        for(let i = 0; i < this.free_p; i++){
            this.pages[i] = {
                free : true,
                page : null 
            };
        }
    }

    public loadProcess(process : Process) : boolean{
        if(process.number_of_pages > this.free_p) return false;
        let process_pages = 0;
        for(let i = 0; i < this.pages.length; i++){
            if(process_pages == process.number_of_pages) break;
            if(this.pages[i].free){
                this.pages[i].page = new Page(i, 4, 'kb', process.PID, process_pages++);
                this.pages[i].free = false;
            }
        }
        return true;
    }

    public isFull() : boolean { return this.free_p === 0; }

    public deleteProcess(pid: string) {
        for(let i = 0; i < this.pages.length; i++)
            if(!this.pages[i].free) 
                if(this.pages[i].page.process_pid === pid)
                    this.pages[i] = {free : true, page : null};
    }

    public hasProcess(pid : string) : boolean {
        for(let i = 0; i < this.pages.length; i++)
            if(!this.pages[i].free)
                if(this.pages[i].page.process_pid === pid) return true;
        return false;
    }

    public toString() : string {
        let cad : string = "";
        this.pages.map(x => {
            if(x.free)
                cad += " # |"
            else
                cad += x.page.process_pid + "-" + x.page.process_page + ' |';
        });
        return cad;
    }



}