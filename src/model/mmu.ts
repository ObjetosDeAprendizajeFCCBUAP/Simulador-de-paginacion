import PhysicalMemory from "./physical_memory";
import Process from "./process";
import VirtualMemory from "./virtual_memory";

export default interface MMU {

    physical: PhysicalMemory;
    virtual: VirtualMemory;

    virtual_time?: number;

    // Working set algorithm
    working_set?: string[];

    // WSClock
    refresh_rate?: number;
    interrupt?: number;
    oldest_frame?: number;

    tau?: number;

    loadProcess(process: Process): void;
    referenceProcess(pid: string, page: number): boolean;
    update?(index: number, pid: string, page: number): void;
    contdown?(): void;

}