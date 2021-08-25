import MMU from "./mmu";
import process from "./process";
import VirtualMemory from "./virtual_memory";
import PhysicalMemory from "./physical_memory";

export default class FIFOR implements MMU {

	physical: PhysicalMemory;
	virtual: VirtualMemory;

	oldest_frame: number;

	constructor(virtual: VirtualMemory, physical: PhysicalMemory){
		this.virtual = virtual;
		this.physical = physical;

		this.oldest_frame = 0;

		console.log('Se creo FIFO');
		console.log(`Virtual: ${virtual} | Fisica: ${physical}`);
	}

	loadProcess(process: process): boolean {
		return this.virtual.loadProcess(process);
	}

	deleteProcess(pid: string): void{
		this.virtual.deleteProcess(pid);
		this.physical.deleteProcess(pid);
	}

	referenceProcess(pid: string, page: number): boolean {
		let fault = true;
		if(this.physical.isFull()){
			if(this.physical.hasProcessPage(pid, page)){
				this.physical.releaseFrame(null, null, this.oldest_frame % this.physical.size);
				this.oldest_frame++;
				this.physical.loadPage(pid, page);
				// this.update(this.oldest_frame % this.physical.size, pid, page);
			} else fault = false;
		} else {
			if(!this.physical.hasProcessPage(pid, page))
				this.physical.loadPage(pid, page);
			else 
				fault = false;
		}
		console.log(`Referencia a ${pid}/${page} con fallo de pagina: ${fault}`);
        console.log(`#${this.physical}`);
        console.log(`#${this.virtual}`);
		return fault;
	}

	getOldest(): number {
		return this.oldest_frame;
	}
}