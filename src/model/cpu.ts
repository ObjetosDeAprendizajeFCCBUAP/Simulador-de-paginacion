// eslint-disable-file no-use-before-define

/**
 * @author Edgar Castro Martinez
 */

import FIFO from './fifo';
import JobQueue from './job_queue';
import Loader, { IProcessInput } from './loader';
import MMU from './mmu';
import PhysicalMemory from './physical_memory';
import Process from './process';
import RoundRobin from './rr_scheduler';
import VirtualMemory from './virtual_memory';
import WorkingSetR from './working_set';
import WSClock from './wsclock';

export default class CPU {

    // Scheduler
    loader              : Loader;
    quantum             : number;
    scheduler           : RoundRobin;

    //MMU
    virtual             : VirtualMemory;
    physical            : PhysicalMemory;
    mmu                 : MMU

    //Variables for control and info.
    computed_time       : number;
    computed_process    : Process;
    current_reference   : number;
    total_processes     : number;
    completed_processes : number;
    ended               : boolean;
    faults              : number
    error_message       : string;

    /**
     * Creates an instance of CPU
     * @constructor
     * @param { IProcessInput[] } processes - List of proceeses to be computed
     * @param { number } physical_size - Number of pages physical memory
     * @param { number } virtual_size - Size of virtual memory
     * @param { number } quantum - Quantum unit
     * @param { string } algorithm - Name of page replacement agorithm to be executed.
     * @param { number } opt1 - For working set algorithm, is the size of working set window. For WSClock is the refresh time
     * @param { number } opt2 - Only for WSClock, is tau unit.
     */
    constructor(processes: IProcessInput[], physical_size: number, virtual_size: number,
            quantum: number, algorithm: string, opt1?: number, opt2?: number){

        this.loader              = new Loader(processes);
        this.quantum             = quantum;
        this.scheduler           = new RoundRobin(new JobQueue(), this.quantum);

        this.physical            = new PhysicalMemory(physical_size);
        this.virtual             = new VirtualMemory(4, virtual_size, 'mb');
        if(algorithm === 'Fifo')
            this.mmu             = new FIFO(this.virtual, this.physical);
        else if(algorithm === 'Set')
            this.mmu             = new WorkingSetR(this.virtual, this.physical, opt1);
        else
            this.mmu             = new WSClock(this.virtual, this.physical, opt1, opt2);

        this.computed_time       = 0;
        this.computed_process    = this.scheduler.nextProcessToCompute();
        this.current_reference   = -1;
        this.total_processes     = this.loader.input.length;
        this.completed_processes = 0;
        this.ended               = false;
        this.faults              = 0;
        this.error_message       = '';
    }

    // public next(): boolean {
    //     this.error_message = '';
    //     const nextToArrive = this.loader.tick(this.computed_time);
    //     //Load new process
    //     if(nextToArrive.length > 0){
    //         nextToArrive.forEach(e => {
    //             const temp = new Process(e.pid, e.total_time, e.pages, e.references)
    //             this.scheduler.registerProcess(temp);
    //             if(!this.mmu.loadProcess(temp)) this.error_message =
    //                     `No se pudo cargar el proceso ${temp.PID} porque la memoria esta llena`;
    //         });
    //     }
    //     //Chose a process
    //     if(this.computed_process === null)
    //         this.computed_process = this.scheduler.nextProcessToCompute();
    //     if(!this.scheduler.tick()){
    //         if(this.computed_process.hasFinished()) this.deleteProcess();
    //         this.computed_process = this.scheduler.nextProcessToCompute();
    //         if(this.hasFinishedTasks()) return false;
    //     }
    //     this.current_reference = this.computed_process.nextReference()
    //     if(this.mmu.referenceProcess(this.computed_process.PID, this.current_reference)) this.faults++;
    //     this.computed_time++;
    //     return true;
    // }


    public next(): string {
        if(this.hasFinishedTasks()) return 'F';
        this.error_message = '';
        const nextToArrive = this.loader.tick(this.computed_time);
        //Load new process
        if(nextToArrive.length > 0){
            nextToArrive.forEach(e => {
                const temp = new Process(e.pid, e.total_time, e.pages, e.references)
                this.scheduler.registerProcess(temp);
                if(!this.mmu.loadProcess(temp)) this.error_message =
                        `No se pudo cargar el proceso ${temp.PID} porque la memoria esta llena`;
            });
        }
        if(this.computed_process === null)
            this.computed_process = this.scheduler.nextProcessToCompute();
            if(this.computed_process === null && this.completed_processes !== this.loader.input.length) {
                this.computed_time++;
                return 'W';
            }
        if(this.scheduler.tick())
            this.computed_process = this.scheduler.nextProcessToCompute();
        this.current_reference = this.computed_process.nextReference()
        if(this.mmu.referenceProcess(this.computed_process.PID, this.current_reference)) this.faults++;
        if(this.computed_process.hasFinished())
            this.deleteProcess();
        this.computed_time++;
        return 'R';
    }


    private deleteProcess() : void {
        this.completed_processes++;
        const pid = this.computed_process.PID;
        this.mmu.deleteProcess(pid);
        this.scheduler.deleteProcess(pid);
        console.log(`Se elimino el proceso ${pid}`)
    }

    public hasFinishedTasks() : boolean {
        const hasComputed = this.computed_process === null;
        const hasInWait = this.completed_processes === this.loader.input.length ;
        return hasComputed && hasInWait;
    }

    public getError(): string { return this.error_message; }

}
