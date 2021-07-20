import VirtualMemory from './virtual_memory';
import PhysicalMemory from './physical_memory';
import Process from './process';
import MMU from './mmu';

export default class WorkingSetR implements MMU {
	
	virtual: VirtualMemory;	
	physical: PhysicalMemory;
	capacity: number;
	working_set: string[];

	
	constructor(virtual: VirtualMemory, physical: PhysicalMemory, window_size: number){
		this.virtual = virtual;
		this.physical = physical;
		this.working_set = [];
		this.capacity = window_size;

		console.log(`!!!!Se creo conjunto de trabajo con capacidad de ${window_size}`);
	}
	
	public loadProcess(process: Process): void {
		this.virtual.loadProcess(process);
	}
	
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
				console.log('***', page);
				for(const frame of this.physical.frames){
					if(frame.frame)
						if(this.working_set.indexOf(`${frame.frame.process_pid}-${frame.frame.process_page}`) !== -1){
							this.physical.releaseFrame(frame.frame.process_pid, frame.frame.process_page);
							this.physical.loadPage(pid, page);
							break;
						}
				}
			} else {
				console.log('###', page);
				this.physical.loadPage(pid, page);
			}
		}
		console.log(this.working_set.length);
		console.log('Working set: ', this.working_set);
		console.log(`Referencia a ${pid}/${page} con fallo de pagina: ${fault}`);
		console.log(`#${this.physical}`);
		return fault;
	}
}