/**
 * @author Edgar Castro Martinez
 */

import Process from "./process";

export default class JobQueue {

    queue : Process[];
    index : number;

    /**
     * Create an instance of JobQueue
     */
    constructor(){
        this.queue = [];
        this.index = 0;
    }

    /**
     * Add a process to the job queue
     * @param { Process } process - The process to be added to the job queue
     */
    public registerProcess(process: Process) : void {
        this.queue.push(process)
    }

    /**
     * Remove a process from the job queue
     * @param { string } pid - The pid of the process to be deleted from the job queue
     */
    public deleteProcess(pid : string) : void {
        this.queue = this.queue.filter(p => p.PID !== pid);
        return;
    }

    /**
     * Chose and return the next process
     * @returns { Process } Return the next process if there one, null otherwise
     */
    public choseProcess() : Process | null {
        if(this.queue.length === 0) return null;
        return this.queue[this.index++ % this.queue.length];
    }

    /**
     * Return the object in string representation.
     */
    public toString() : string {
        return this.queue.join('-----------------\n');
    }

}
