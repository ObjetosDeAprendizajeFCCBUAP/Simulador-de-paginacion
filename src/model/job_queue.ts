import Process from "./process";
// import { readFileSync } from 'fs';

export default class JobQueue {

    queue : Process[];
    index : number;

    constructor(){
        this.queue = [];
        this.index = 0;
    }

    public registerProcess(process: Process) : void {
        this.queue.push(process)
    }

    public deleteProcess(pid : string) : void {
        this.queue = this.queue.filter(p => p.PID !== pid);
        return;
    }

    public choseProcess() : Process | null {
        if(this.queue.length === 0) return null;
        return this.queue[this.index++ % this.queue.length];
    }

    public toString() : string {
        return this.queue.join('-----------------\n');
    }
}
