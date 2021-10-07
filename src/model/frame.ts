/**
 * @author Edgar Castro Martinez
 */

/**
 * @interface IFrame - To have an input format.
 * @member free - For know if the frame is free or not.
 * @member frame - The information of frame.
 */
export interface IFrame {
    free : boolean;
    frame : Frame;
}

export class Frame {
    frame_number    : number;
    size            : number;
    unit            : string;

    process_pid     : string;
    process_page    : number;

    referenced_bit  : boolean;
    dirty           : boolean;
    age             : number;

    /**
     * Create an instance of a frame.
     * @param frame_number - The number or index of frame in memory.
     * @param size - The size of the frame.
     * @param unit - The unit of the frame.
     * @param pid - The pid of process that contains the frame.
     * @param page - The page of process that contains the frame.
     */
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

    /**
     * Set a dirt state for the frame.
     * @param { boolean } dirt - Dirt state.
     */
    public dirt(dirt: boolean): void {
        this.dirty = dirt;
    }

    /**
     * Return the dirty state of frame.
     * @returns { boolean } dirty state.
     */
    public isDirty(): boolean{
        return this.dirty;
    }

    /**
     * Set a referenced state for the frame.
     * @param { boolean } ref - Referenced state.
     */
    public reference(ref: boolean): void {
        this.referenced_bit =  ref;
    }

    /**
     * Return the referenced state of the frame.
     * @returns { boolean } - Referenced state.
     */
    public isReferenced(): boolean {
        return this.referenced_bit;
    }

    /**
     * Clean the referenced bit of the frame.
     */
    public cleanReferencedBit(): void {
        this.referenced_bit = false;
    }

}