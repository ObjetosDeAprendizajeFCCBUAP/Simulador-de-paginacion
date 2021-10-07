import VirtualMemory from './virtual_memory';
import PhysicalMemory from './physical_memory';
import Process from './process';
import MMU from './mmu';

export default class WorkingSetR implements MMU {

	virtual			: VirtualMemory;
	physical		: PhysicalMemory;
	capacity		: number;
	working_set		: string[];

	/**
	 * Creates a working set algorithm
	 * @param virtual - An instance of virtual memory
	 * @param physical - An instance of physical memory
	 * @param window_size - The number of slots in working set
	 */
	constructor(virtual: VirtualMemory, physical: PhysicalMemory, window_size: number){
		this.virtual 		= virtual;
		this.physical 		= physical;
		this.working_set 	= [];
		this.capacity 		= window_size;
	}

	/**
	 * Load a process to virtual memory
	 * @param process - The process to be loaded
	 * @returns true if the process can be loaded, false otherwise
	 */
	public loadProcess(process: Process): boolean {
		return this.virtual.loadProcess(process);
	}

	/**
	 * Removes a process form virtual and physical memory
	 * @param pid - The PID of the process to be removed
	 */
	public deleteProcess(pid: string): void {
		this.virtual.deleteProcess(pid);
		this.physical.deleteProcess(pid);
	}

	/**
	 * Reference a process based on working set algorithm
	 * @param pid - The PID of the process to be referenced
	 * @param page - The page of the process to be referenced
	 * @returns true if exist page fault, false otherwise
	 */
	public referenceProcess(pid: string, page: number): boolean {
		let fault = false;
		const referenced = `${pid}-${page}`;
		if(this.working_set.indexOf(referenced) !== -1){
			this.working_set = this.working_set.filter(x => x !== referenced);
			this.working_set.push(referenced);
		} else {
			if(this.working_set.length >= this.capacity){
				this.working_set = this.working_set.slice(1);
				this.working_set.push(referenced);
			} else {
				this.working_set.push(referenced);
			}
			fault = true;
		}
		if(!this.physical.hasProcessPage(pid, page)){
			if(this.physical.isFull()){
				for(const frame of this.physical.frames){
					if(frame.frame)
						if(this.working_set.indexOf(`${frame.frame.process_pid}-${frame.frame.process_page}`) === -1){
							this.physical.releaseFrame(frame.frame.process_pid, frame.frame.process_page);
							this.physical.loadPage(pid, page);
							break;
						}
				}
			} else {
				this.physical.loadPage(pid, page);
			}
		}
		return fault;
	}

}