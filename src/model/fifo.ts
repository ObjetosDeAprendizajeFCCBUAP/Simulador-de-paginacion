/**
 * @author Edgar Castro Martinez
 */

import MMU from "./mmu";
import Process from "./process";
import VirtualMemory from "./virtual_memory";
import PhysicalMemory from "./physical_memory";

export default class FIFO implements MMU {

    physical: PhysicalMemory;
    virtual: VirtualMemory;

    oldest_frame: number;

    /**
     * Creates an FIFO page replacement algorithm instance for the memory management 
     * @constructor
     * @param { VirtualMemory } virtual - An instance of virtual memory
     * @param { PhysicalMemory } physical - An instance of physical memory
     */
    constructor(virtual: VirtualMemory, physical: PhysicalMemory){
        this.virtual 		= virtual;
        this.physical 		= physical;

        this.oldest_frame 	= 0;
    }

    /**
     * Load a process to memory
     * @param { Process } process - The process to load
     * @returns { boolean } True if the process load successfully, else otherwise 
     */
    loadProcess(process: Process): boolean {
        return this.virtual.loadProcess(process);
    }

    /**
     * Delete a process from virtual and physical memory.
     * @param { string } pid - The pid of the process to be deleted
     */
    deleteProcess(pid: string): void{
        this.virtual.deleteProcess(pid);
        this.physical.deleteProcess(pid);
    }

    /**
     * Make a reference to specific process page
     * @param { string } pid - Process PID
     * @param { number } page - Process page
     * @returns { boolean } - return true if exist page fault
     */
    referenceProcess(pid: string, page: number): boolean {
        if(this.physical.isFull()){
            if(!this.physical.hasProcessPage(pid, page)){
                this.physical.releaseFrame(null, null, this.oldest_frame % this.physical.size);
                this.oldest_frame++;
                this.physical.loadPage(pid, page);
            } else return false;
        } else {
            if(!this.physical.hasProcessPage(pid, page))
                this.physical.loadPage(pid, page);
            else
                return false;
        }
        return false;
    }

    /**
     * Gets the oldest frame in physical memory
     * @returns { number } the number of frame in physical memory
     */
    getOldest(): number {
        return this.oldest_frame;
    }

}