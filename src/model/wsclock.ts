import VirtualMemory from './virtual_memory';
import PhysicalMemory from './physical_memory';
import Process from './process';
import MMU from './mmu';

export default class WSClock implements MMU {

	virtual			: VirtualMemory;
	physical		: PhysicalMemory;

	virtual_time	: number;
	refresh			: number;
	interrupt		: number;
	oldest 			: number;

	tau				: number;

	/**
	 * Create an instance of WSClock algorithm
	 * @param virtual - an instance of virtual memory
	 * @param physical - an instance of physical memory
	 * @param refresh_rate
	 * @param tau
	 */
	constructor(virtual: VirtualMemory, physical: PhysicalMemory, refresh_rate: number,
				tau: number){
		this.virtual 		= virtual;
		this.physical 		= physical;

		this.refresh 		= refresh_rate;
		this.interrupt 		= 0;
		this.virtual_time 	= 0;
		this.oldest 		= 0;

		this.tau 			= tau;
	}

	/**
	 * Loads a process to virtual memory
	 * @param process - The process to load
	 */
	public loadProcess(process: Process): boolean {
		return this.virtual.loadProcess(process);
	}

	/**
	 * Removes a process from virtual an physical memory
	 * @param pid - The pid of the process to be deleted
	 */
	deleteProcess(pid: string): void {
		this.virtual.deleteProcess(pid);
		this.physical.deleteProcess(pid);
	}

	/**
	 * Update the state of algorithm
	 */
	public tick(): void {
		this.interrupt = this.interrupt + 1 % this.refresh;
		if(this.interrupt == 0)
			for(let i = 0; i < this.physical.size; i++)
				this.physical.frames[i].frame.reference(false);
	}

	/**
	 * Make a reference of specific page process
	 * @param pid - The PID of the process to be referenced
	 * @param page - The page of the process to be referenced
	 */
	public referenceProcess(pid: string, page: number): boolean {
		let fault = false;
		this.virtual_time++;
		let frameLocation = this.physical.getFrame(pid, page);
		if(frameLocation === -1){ //Si la pagina NO esta esta en memoria
			if(this.physical.isFull()){ //Si la memoria esta llena
				fault = true;
				let looking = true;
				let current = this.oldest;
				let index = 0;
				while(index < this.physical.size && looking){
					if(!this.physical.frames[current].frame.isReferenced() &&
						!this.physical.frames[current].frame.isDirty()){
								this.update(current, pid, page);
								looking = false;
								frameLocation = current;
					} else if(!this.physical.frames[current].frame.isReferenced() &&
						this.physical.frames[current].frame.isDirty() &&
						this.virtual_time - this.physical.frames[current].frame.age < this.tau){
							this.physical.frames[current].frame.dirt(false);
							index = 0;
					} else {
						index++;
					}
					current = (current + 1) % this.physical.size;
				}
				if(looking){
					if(this.physical.frames[this.oldest].frame.isDirty())
						this.update(this.oldest, pid, page);
					frameLocation = this.oldest;
				}
				this.oldest = this.physical.getOldest(this.oldest);
			} else { //Si la memoria no esta llena
				fault = true;
				this.physical.loadPage(pid, page);
			}
		} else {
			this.update(frameLocation, pid, page);
		}
		return fault;
	}

	/**
	 * Updates the state of an specific process page
	 * @param index - The index of memory to be updated
	 * @param pid - The PID of the process to be updated
	 * @param page - The page of the process to be upfated
	 */
	public update(index: number, pid: string, page: number) : void {
		this.physical.updateFrame(index, pid, page, this.virtual_time);
	}

}