export interface IFrame {
    free : boolean;
    frame : Frame;
}

export class Frame {
    frame_number : number;
    size         : number;
    unit         : string;

    referenced_bit  : boolean;
    dirty           : boolean;
    age             : number;

    process_pid  : string;
    process_page : number;

    constructor(frame_number : number, size : number, unit : string, pid : string, page : number){
        this.frame_number   = frame_number;
        this.size           = size;
        this.unit           = unit;

        this.referenced_bit = false;
        this.dirty          = false;
        this.age            = -1;
        
        this.process_pid    = pid;
        this.process_page   = page;
    }

    public dirt(dirt: boolean): void {
        this.dirty = dirt;
    }

    public isDirty(): boolean{
        return this.dirty;
    }

    public reference(ref: boolean): void {
        this.referenced_bit =  ref;
    }

    public isReferenced(): boolean {
        return this.referenced_bit;
    }

    public cleanReferencedBit(): void {
        this.referenced_bit = false;
    }

}