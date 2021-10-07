/**
 * @author Edgar Castro Martinez
 */

import { Frame, IFrame } from "./frame";

export default class PhysicalMemory {

    frames  : IFrame[];
    size    : number;

    /**
     * Creates an instance of Physical Memory
     * @param frames_number - Number of frames that memory has
     */
    constructor(frames_number : number){
        this.frames = [];
        this.size   = frames_number;
        this.initFrames();
    }

    /**
     * Initialize all frames
     */
    private initFrames(): void {
        for(let i =0 ; i < this.size; i++)
            this.frames[i] = {free : true, frame : null };
    }

    /**
     * Load a process to physical memory
     * @param pid - The pid of process to load
     * @param page - The page of process to load
     */
    public loadPage(pid: string, page: number): void {
       let index: number;
        for(index = 0; !this.frames[index].free && index < this.size; index++);
        this.frames[index] = {
           free: false,
           frame: new Frame(index, 4, 'kb', pid, page)
       }
    }

    /**
     * Delete a process from memory
     * @param pid - The pid of process to be deleted
     */
    public deleteProcess(pid: string): void {
        for(let i = 0; i < this.frames.length; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid)
                    this.frames[i] = {free : true, frame : null};
    }

    /**
     * Update the information of specific frame in memory
     * @param index - Index of frame in memory
     * @param pid - PID of the process to be updated
     * @param page - Page of the process to be updated
     * @param _age - The age
     */
    public updateFrame(index: number, pid: string, page: number, _age?: number) : void{
        this.frames[index].frame.process_pid = pid;
        this.frames[index].frame.process_page = page;
        this.frames[index].frame.age = _age;
        this.frames[index].frame.reference(true);
    }

    /**
     * Returns the index of one specific frame in memory
     * @param pid - PID of the process to get index
     * @param page - Page of the process to get index
     * @returns The index of the process, -1 if the process not exist in memory
     */
    public getFrame(pid: string, page: number): number{
        for(let i = 0; i < this.size; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid &&
                    this.frames[i].frame.process_page === page)
                    return i;
        return -1;
    }

    /**
     * Check if an specific process page exist in memory
     * @param pid - The PID of the process
     * @param page - The page of the process
     * @returns true if the page exist in memory, false otherwise
     */
    public hasProcessPage(pid : string, page : number) : boolean {
        for(let i = 0; i < this.size; i++)
            if(!this.frames[i].free)
                if(this.frames[i].frame.process_pid === pid &&
                    this.frames[i].frame.process_page === page)
                    return true;
        return false;
    }

    /**
     * Make a referene to an spacific page
     * @param pid - The PID of the process to reference
     * @param page - The page of the process to reference
     */
    public refProcessPage(pid: string, page: number): void {
        for(const frame of this.frames){
            if(frame.frame.process_pid === pid && frame.frame.process_page === page){
                frame.frame.reference(true);
                break;
            }
        }
    }

    /**
     * Release specific frame from memory, by PID and process, or index of memory
     * @param pid - The PID of the process to release
     * @param page - The page of the process
     * @param index - The index of memory frame to be released
     */
    public releaseFrame(pid?: string, page?: number, index?: number): void {
        if(pid && page){
            let index = -1;
            for(let i = 0; i < this.frames.length; i++)
                if(this.frames[i].frame)
                    if(this.frames[i].frame.process_pid == pid && this.frames[i].frame.process_page == page){
                        index = i;
                        break;
                    }
            if(index !== -1)
                this.frames[index] = { frame: null, free: true };
        }
        if(index)
            this.frames[index] = { frame: null, free: true };
    }

    /**
     * Return the index of the oldest frame
     * @param oldest - The oldest frame
     * @returns Index of the oldest frame
     */
    public getOldest(oldest: number): number {
        for(let i = 0; i < this.size; i++)
            if(this.frames[i].frame.age < this.frames[oldest].frame.age)
                return i;
         return oldest;
    }

    /**
     * Check if the memory is full
     * @returns true if the pafe is full, false otherwise
     */
    public isFull(): boolean {
        let band = false;
        for(let i = 0; i < this.size; band = band || this.frames[i].free, i++);
        return !band
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