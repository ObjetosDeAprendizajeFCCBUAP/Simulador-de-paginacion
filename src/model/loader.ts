/**
 * @author Edgar Castro Martinez
 */

/**
 * @interface IProcessInput - To have an input format
 * @field pid - The process PID
 * @field arrival_time - Time when the process loadd to CPU
 * @field total_tiem - The time to take the process ends
 * @field pages - The number of pages that the process has
 * @field references [optional] The list of references to make
 */
export interface IProcessInput {
    pid             : string;
    arrival_time    : number;
    total_time      : number;
    pages           : number;
    references?     : number[];
}

//Just a type definition that define a dictionary where the keys are numbers
//and the values are InputProcesses
type sortedProcDict = { [index: number]: IProcessInput[] };

export default class Loader {

    input: IProcessInput[];
    sortedProcesses: sortedProcDict;

    /**
     * Creates an instance of Loader
     * @param { IProcessInput[] } input - The list of process
     */
    constructor(input: IProcessInput[]) {
        this.input              = input;
        this.sortedProcesses    = {} as sortedProcDict;
        this.sortInput(input);
    }

    /**
     * Excecute a CPU tick and check if have processes to arrive
     * @param time - The time in CPU
     */
    public tick(time: number): IProcessInput[] {
        return this.sortedProcesses[time] ? this.sortedProcesses[time] : [];
    }

    /**
     * Sort the processes based on the arrival time and groups them
     * @param { IProcessInput[] } input - the list of the process
     */
    private sortInput(input: IProcessInput[]): void {
        //this.input = input.sort((a, b) => a.arrival_time - b.arrival_time);
        input.forEach(e => {
            if (this.sortedProcesses[e.arrival_time])
                this.sortedProcesses[e.arrival_time].push(e);
            else
                this.sortedProcesses[e.arrival_time] = [e];
        });
    }

}
