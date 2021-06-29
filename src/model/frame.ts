export interface IFrame {
    free : boolean;
    frame : Frame;
}

export class Frame {
    frame_number : number;
    size         : number;
    unit         : string;

    process_pid  : string;
    process_page : number;

    constructor(frame_number : number, size : number, unit : string, pid : string, page : number){
        this.frame_number   = frame_number;
        this.size           = size;
        this.unit           = unit;
        
        this.process_pid = pid;
        this.process_page = page;
    }

}