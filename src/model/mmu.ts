/**
 * @author Edgar Castro Martinez
 */

import PhysicalMemory from "./physical_memory";
import Process from "./process";
import VirtualMemory from "./virtual_memory";

/**
 * @interface MMU - A simple interface to implement in all page replacement algorithms
 */
export default interface MMU {

    // ------- [VARIABLES] -------
    physical        : PhysicalMemory;
    virtual         : VirtualMemory;

    virtual_time?   : number;

    // Working set algorithm
    working_set?     : string[];

    // WSClock
    refresh_rate?   : number;
    interrupt?      : number;
    oldest_frame?   : number;

    tau?            : number;

    // ------- [FUNCTIONS] -------
    loadProcess(process: Process)                       : boolean;
    referenceProcess(pid: string, page: number)         : boolean;
    deleteProcess(pid: string)                          : void;
    update?(index: number, pid: string, page: number)   : void;
    contdown?()                                         : void;
    getOldest?()                                        : number;

}