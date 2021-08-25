import { Frame, IFrame } from "./frame";

export default class PhysicalMemory {
    

    frames  : IFrame[];
    size    : number;

    constructor(frames_number : number){
        this.frames = [];
        this.size = frames_number;
        this.initFrames();
    }

    public initFrames(): void {
        for(let i =0 ; i < this.size; i++)
            this.frames[i] = {free : true, frame : null };
    }
    
    public loadPage(pid: string, page: number): void {
       let index: number;
        for(index = 0; !this.frames[index].free && index < this.size; index++);
        this.frames[index] = {
           free: false,
           frame: new Frame(index, 4, 'kb', pid, page)
       }
    }

    public deleteProcess(pid: string): void {
        for(let i = 0; i < this.frames.length; i++)
            if(!this.frames[i].free) 
                if(this.frames[i].frame.process_pid === pid)
                    this.frames[i] = {free : true, frame : null};
    }

    public updateFrame(index: number, pid: string, page: number, _age?: number) : void{
        this.frames[index].frame.process_pid = pid;
        this.frames[index].frame.process_page = page;
        this.frames[index].frame.age = _age;
        this.frames[index].frame.reference(true);
    }

    public getFrame(pid: string, page: number): number{
        for(let i = 0; i < this.size; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid && 
                    this.frames[i].frame.process_page === page)
                    return i;
        return -1;
    }

    public hasProcessPage(pid : string, page : number) : boolean {
        for(let i = 0; i < this.size; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid && 
                    this.frames[i].frame.process_page === page)
                    return true;
        return false;
    }

    public refProcessPage(pid: string, page: number): void {
        for(const frame of this.frames){
            if(frame.frame.process_pid === pid && frame.frame.process_page === page){
                frame.frame.reference(true);
                break;
            }
        }
    }

    public isFull(): boolean {
        let band = false;
        for(let i = 0; i < this.size; band = band || this.frames[i].free, i++);
        return !band
    }

    public releaseFrame(pid?: string, page?: number, index?: number): void {
        console.log(`Vamos a eliminar: ${pid}-${page}`);
        if(pid && page){
            let index = -1;
            for(let i = 0; i < this.frames.length; i++)
                if(this.frames[i].frame)
                    if(this.frames[i].frame.process_pid == pid && this.frames[i].frame.process_page == page){
                        console.log('Se removio el marco');
                        index = i;
                        break;
                    }
            if(index !== -1)
                this.frames[index] = { frame: null, free: true }; 
        }
        if(index)
            this.frames[index] = { frame: null, free: true };
    }

    public getOldest(oldest: number): number {
        for(let i = 0; i < this.size; i++)
            if(this.frames[i].frame.age < this.frames[oldest].frame.age)
                return i;
         return oldest;
    }

    public toString() : string{
        let cad = '';
        this.frames.forEach(x => {
            if(x.free) 
                cad += ' # |';
            else
                if(x.frame.referenced_bit)
                    cad += ` (${x.frame.process_pid}-${x.frame.process_page}) |`;
                else
                    cad += ` ${x.frame.process_pid}-${x.frame.process_page} |`;
        });
        return cad;
    }

}