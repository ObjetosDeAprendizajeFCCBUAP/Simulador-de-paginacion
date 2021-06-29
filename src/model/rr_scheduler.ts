import JobQueue from "./job_queue";
import Process from "./process";

export default class RoundRobin {

    job_queue       : JobQueue;
    current_process : Process;
    quantum         : number;
    computed_time   : number;

    constructor(job_queue : JobQueue, quantum : number){
        this.job_queue = job_queue;
        this.current_process = null;
        this.quantum = quantum;
        this.computed_time = 0;
    }

    public nextProcessToCompute() : Process | null {
        this.current_process = this.job_queue.choseProcess();
        this.computed_time = 0;
        return this.current_process;
    }

    public tick() : boolean {
        if(this.current_process === null) return true;
        if(++this.current_process.computed_time > this.current_process.total_time ||
            ++this.computed_time >= this.quantum) return true;
        return false;
    }

    public registerProcess(process : Process){
        console.log('Se registor el proceso: ', process);
        this.job_queue.registerProcess(process);
    }

    public deleteProcess(pid : string) : void {
        this.job_queue.deleteProcess(pid);
    }



}





