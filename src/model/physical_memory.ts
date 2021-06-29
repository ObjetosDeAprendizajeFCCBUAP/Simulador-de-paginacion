import { Frame, IFrame } from "./frame";

export default class PhysicalMemory {
    

    frames  : IFrame[];
    size    : number;
    f_index : number;
    free_frames : number;
    fifo_index : number;

    constructor(frames_number : number){
        this.frames = [];
        this.size = frames_number;
        this.f_index = 0;
        this.initFrames();
        this.free_frames = this.size;
        this.fifo_index = 0;
    }

    public initFrames(): void {
        for(let i =0 ; i < this.size; i++)
            this.frames[i] = {free : true, frame : null };
    }
    
    public loadPage(pid: string, page: number): void {
        /*
        if(this.free_frames < 0) { // Si hay libres1
            if(this.hasProcessPage(pid, page)) return false;
            this.frames[this.f_index++ % this.frames.length] = {
                free : false,
                frame : new Frame(this.f_index, 4, 'kb', pid, page)
            }  
       } else {
            this.releaseFrame();
            this.frames[this.f_index++ % this.frames.length] = {
                free : false,
                frame : new Frame(this.f_index, 4, 'kb', pid, page)
            }  
       }
       return false;
       */
       this.frames[this.f_index++ % this.frames.length] = {
           free: false,
           frame: new Frame(this.f_index % this.frames.length, 4, 'kb', pid, page)
       }
    }

    public hasProcessPage(pid : string, page : number) : boolean {
        for(let i = 0; i < this.frames.length; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid && this.frames[i].frame.process_page === page){
                    console.log('Si lo tengo')
                    return true;
                }
        console.log('No lo tengo');
        return false;
    }

    public isFull(): boolean {
        return this.frames.length === this.size;
    }

    public releaseFrame(): void {
        this.frames[this.fifo_index++ % this.frames.length] = {free : true, frame : null };
    }

    public toString() : string{
        let cad = '';
        this.frames.map(x => {
            if(x.free) 
                cad += ' # |';
            else
                cad += ` ${x.frame.process_pid}-${x.frame.process_page} |`;
        });
        return cad;
    }

}