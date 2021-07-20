// eslint-disable-file no-use-before-define
import FIFOR from './fifo';
import FIFO from './fifo_page_replace';
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

    scheduler           : RoundRobin;
    computed_process    : Process;
    current_reference   : number;
    ended               : boolean;
    computed_time       : number;

    next_proc_t_arrival : number;
    next_proc           : Process;

    total_processes     : number;
    completed_processes : number;

    virtual : VirtualMemory;
    physical: PhysicalMemory;

    fifo : FIFO;
    loader: Loader;

    quantum: number;

    mmu: MMU

    input : IProcessInput[] =  [
        {
            pid: 'A',
            arrival_time: 0,
            total_time : 5,
            pages: 2,
        },
        {
            pid: 'B',
            arrival_time: 4,
            total_time : 10,
            pages: 2,
        },
        {
            pid: 'C',
            arrival_time: 1,
            total_time : 3,
            pages: 2,
        },
        {
            pid: 'D',
            arrival_time: 3,
            total_time : 5,
            pages: 2,
        },
    ];

    inputTest : IProcessInput[] =  [
        {
            pid: 'A',
            arrival_time: 0,
            total_time : 10,
            pages: 6,
            references: [1, 2, 3, 4, 2, 5, 6, 2, 7, 9, 2, 1, 7, 2, 3, 6, 2, 3, 1],
        },
    ]
    //     {
    //         pid: 'B',
    //         arrival_time: 0,
    //         total_time : 10,
    //         pages: 2,
    //     },
    //     {
    //         pid: 'C',
    //         arrival_time: 4,
    //         total_time : 3,
    //         pages: 2,
    //     },
    //     {
    //         pid: 'D',
    //         arrival_time: 4,
    //         total_time : 5,
    //         pages: 2,
    //     },
    // ];

    constructor(processes: IProcessInput[], physical_size: number, virtual_size: number, 
            quantum: number, algorithm: string, opt1?: number, opt2?: number){
        this.loader = new Loader(processes);
        this.scheduler = new RoundRobin(new JobQueue(), this.quantum);
        this.computed_process = this.scheduler.nextProcessToCompute();
        this.ended = false;
        this.computed_time = 0;
        this.input = this.input.sort((a, b) => {
            return b.arrival_time - a.arrival_time;
        });

        this.quantum = quantum;

        this.physical = new PhysicalMemory(physical_size);
        this.virtual = new VirtualMemory(4, virtual_size, 'mb');

        this.total_processes = 0;
        this.completed_processes = 0;

        // this.fifo = new FIFO(this.virtual, this.physical);
        // this.fifo = new WorkingSet(this.virtual, this.physical, 2);
        if(algorithm === 'Fifo')
            this.mmu = new FIFOR(this.virtual, this.physical);
        else if(algorithm === 'Set')
            this.mmu = new WorkingSetR(this.virtual, this.physical, opt1);
        else 
            this.mmu = new WSClock(this.virtual, this.physical, opt1, opt2);

        this.input = processes.length > 0 ? processes.sort((a, b) => {
            return b.arrival_time - a.arrival_time; }) : this.input;
    }

    public next(): boolean {
        console.log(`[TIME]> ${this.computed_time}`);
        const nextToArrive = this.loader.tick(this.computed_time);
        //Cargar los procesos 
        if(nextToArrive.length > 0){
            console.log('Se cargaron procesos');
            nextToArrive.forEach(e => {
                const temp = new Process(e.pid, e.total_time, e.pages, e.references)
                this.scheduler.registerProcess(temp);
                //Agregar alguna condicion para que muestre error si el proceso no cabe en memoria
                // this.fifo.loadProcess(temp);
                this.mmu.loadProcess(temp);
            });
        } 
        if(this.computed_process === null)
            this.computed_process = this.scheduler.nextProcessToCompute();
        //if(this.hasFinishedTasks()) return false;
        if(!this.scheduler.tick()){
            if(this.computed_process.hasFinished()) this.deleteProcess();
            this.computed_process = this.scheduler.nextProcessToCompute();
            if(this.hasFinishedTasks()) return false;
        }
        this.current_reference = this.computed_process.nextReference()
        // this.fifo.referenceProcessPage(this.computed_process.PID, this.current_reference);
        this.mmu.referenceProcess(this.computed_process.PID, this.current_reference);
        console.log(`${this.computed_process.PID}-${this.current_reference}`);
        this.computed_time++;
        return true;
    }

    private deleteProcess() : void {
        this.completed_processes++;
        const pid = this.computed_process.PID;
        this.virtual.deleteProcess(pid);
        this.scheduler.deleteProcess(pid);
        //this.mmu.deleteProcess(pid);
        console.log(`Se elimino el proceso ${pid}`)
    }

    public hasFinishedTasks() : boolean {
        const hasComputed = this.computed_process === null;
        const hasInWait = this.completed_processes === this.loader.input.length ;
        return hasComputed && hasInWait;
        // return false;
    }

}
