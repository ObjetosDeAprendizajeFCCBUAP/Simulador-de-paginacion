import VirtualMemory from './virtual_memory';
import PhysicalMemory from './physical_memory';
import Process from './process';
import MMU from './mmu';

export default class WSClock implements MMU {
	
	virtual: VirtualMemory;	
	physical: PhysicalMemory;

	virtual_time: number;
	refresh		: number;
	interrupt	: number;
	oldest 		: number;

	tau: number;
	
	constructor(virtual: VirtualMemory, physical: PhysicalMemory, refresh_rate: number,
				tau: number){
		this.virtual = virtual;
		this.physical = physical;

		this.refresh = refresh_rate;
		this.interrupt = 0;
		this.virtual_time = 0;
		this.oldest = 0;

		this.tau = tau;


		console.log(`!!!Se creo wsclock con rate: ${refresh_rate} y con tau: ${tau}`);
	}
	
	public loadProcess(process: Process){
		this.virtual.loadProcess(process);
	}

	public tick(){
		this.interrupt = this.interrupt + 1 % this.refresh;
		if(this.interrupt == 0)
			for(let i = 0; i < this.physical.size; i++)
				this.physical.frames[i].frame.reference(false);
	}
	
	public referenceProcess(pid: string, page: number){
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
								// this.physical.updateFrame(current, pid, page, this.virtual_time);
								this.update(current, pid, page);
								looking = false;
								frameLocation = current;
					} else if(!this.physical.frames[current].frame.isReferenced() &&
						this.physical.frames[current].frame.isDirty() &&
						this.virtual_time - this.physical.frames[current].frame.age < this.tau){
							this.physical.frames[current].frame.dirt(false);
							// diskWrites++;
							index = 0;
					} else {
						index++;
					}
					current = (current + 1) % this.physical.size;
				}
				if(looking){
					if(this.physical.frames[this.oldest].frame.isDirty())
						// diskWrites++;
					// this.physical.updateFrame(this.oldest, pid, page, this.virtual_time);
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
		console.log(`Referencia a ${pid}/${page} con fallo de pagina: ${fault}`);
		console.log(`#${this.physical}`)
		return fault;
	}

	public update(index: number, pid: string, page: number){
		this.physical.updateFrame(index, pid, page, this.virtual_time);
	}
}