import VirtualMemory from './virtual_memory';
import PhysicalMemory from './physical_memory';
import Process from './process';

export default class WorkingSet {
	
	virtual: VirtualMemory;	
	physical: PhysicalMemory;
	capacity: number;
	working_set: string[];

	virtual_time: number;
	refresh		: number;
	interrupt	: number;
	oldest 		: number;

	tau;
	
	constructor(virtual: VirtualMemory, physical: PhysicalMemory, window_size: number){
		this.virtual = virtual;
		this.physical = physical;
		this.working_set = [];
		this.capacity = window_size;

		this.refresh = 4;
		this.interrupt = 0;
		this.virtual_time = 0;
		this.oldest = 0;

		this.tau = 3;
	}
	
	public loadProcess(process: Process): void {
		this.virtual.loadProcess(process);
	}
	
	public referenceProcessPage(pid: string, page: number): boolean{
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


	public tick(): void {
		this.interrupt = this.interrupt + 1 % this.refresh;
		if(this.interrupt == 0)
			for(let i = 0; i < this.physical.size; i++)
				this.physical.frames[i].frame.reference(false);
	}
	
	public replace(pid: string, page: number): boolean{
		let fault = false;
		this.virtual_time++;
		let frameLocation = this.physical.getFrame(pid, page);
		if(frameLocation !== -1){ //Si la pagina NO esta en memoria
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
		}
		return fault;
	}

	public update(index: number, pid: string, page: number): void {
		this.physical.updateFrame(index, pid, page, this.virtual_time);
	}

}
/* clock
if physical memory is full
	if referenced page in physical memory
		change page referenced bit to 1
		fault <- false
	else 
		for each page in physical memory
			if page referenced bit is 1
				change page referenced bit to 0
			else 
				delete page to physical memory
				add the referenced page to physical memory
				fault <- true
				break loop		
else 
	add the referenced page to physical memory 
	fault <- true
return fault

*/


/**  working set

if referenced page in working set
	if working set capacity is full
		delete last recent used page
		insert the page as most recent used
	else
		insert the page as most recent used
else
	if working set capacity is full
		delete last recent used page
		insert the page as most recent used
	else
		insert the page as most recent used
	return fault
*/

/*
if referenced pafe is in physical memory
	set referenced bit to 1
else 
	fault <- true
if fault
	if page where clock point referenced bit is 1
		set referenced bit to 0
	else 
		if clock time - page age > t
			replace page where clock is point with the new page
		else 


*/