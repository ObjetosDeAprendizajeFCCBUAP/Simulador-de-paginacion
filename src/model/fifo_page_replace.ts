import PhysicalMemory from "./physical_memory";
import Process from "./process";
import VirtualMemory from "./virtual_memory";

export default class FIFO {

    virtual : VirtualMemory;
    physical : PhysicalMemory;

    constructor(virtual: VirtualMemory, physical: PhysicalMemory){
        this.virtual = virtual;
        this.physical = physical;
    }

    public loadProcess(process: Process){
        this.virtual.loadProcess(process);
    }

    public referenceProcessPage(pid : string, page : number) {
        let fault = true;
        if(this.physical.isFull()){
            if(!this.physical.hasProcessPage(pid, page)){
                this.physical.releaseFrame();
                this.physical.loadPage(pid, page);
            } else fault = false;
        } else
            if(!this.physical.hasProcessPage(pid, page))
                this.physical.loadPage(pid, page);
            else 
                fault = false;
        console.log(`Referencia a ${pid}/${page} con fallo de pagina: ${fault}`);
        console.log(`#${this.physical}`);
    }

}