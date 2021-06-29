import { JobQueue } from "./job_queue";

export class Scheduler {

    protected job_queue : JobQueue;

    constructor(job_queue : JobQueue){
        this.job_queue = job_queue;
    }

}