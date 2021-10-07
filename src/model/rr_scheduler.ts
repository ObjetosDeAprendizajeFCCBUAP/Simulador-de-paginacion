import JobQueue from "./job_queue";
import Process from "./process";

export default class RoundRobin {

    job_queue       : JobQueue;
    current_process : Process;
    quantum         : number;
    computed_time   : number;

    /**
     * Creates an Round Robin scheduler for process.
     * @param job_queue - The queue of process for be scheduling
     * @param quantum - The unit of time
     */
    constructor(job_queue : JobQueue, quantum : number){
        this.job_queue = job_queue;
        this.current_process = null;
        this.quantum = quantum;
        this.computed_time = 0;
    }

    /**
     * Get the next process to be computed
     * @returns The next process, null if there are no process
     */
    public nextProcessToCompute() : Process | null {
        this.current_process = this.job_queue.choseProcess();
        this.computed_time = 0;
        return this.current_process;
    }

    /**
     * Updates the state of scheduler for know if has to change the process to be computed
     */
    public tick() : boolean {
        if(this.current_process === null) return true;
        if(++this.current_process.computed_time > this.current_process.total_time ||
            ++this.computed_time >= this.quantum) return true;
        return false;
    }

    /**
     * Add a process to the job queue
     * @param process - The process to be added to scheduler
     */
    public registerProcess(process : Process): void {
        this.job_queue.registerProcess(process);
    }

    /**
     *
     * @param pid - The PID of the process to be removed from the job queue
     */
    public deleteProcess(pid : string) : void {
        this.job_queue.deleteProcess(pid);
    }

}





