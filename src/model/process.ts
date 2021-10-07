export default class Process {

    PID             : string;
    references      : number[];
    computed_time   : number;
    total_time      : number;
    number_of_pages : number;

    /**
     * Creates an instance of a single process
     * @param pid - The PID of the process
     * @param total_time - The total time to be computed
     * @param number_of_pages - The number of pages that contains
     * @param references - The list of page references to do.
     */
    constructor(pid : string, total_time : number, number_of_pages : number, references? : number[] ){
        this.PID                = pid;
        this.total_time         = total_time;
        this.number_of_pages    = number_of_pages;
        this.references         = references || this.createRandomReferences();
        this.computed_time      = 0;
    }

    /**
     * Create random references based on the number of pages that process had
     * @returns An array of numbers that represents references
     */
    private createRandomReferences() : number[] {
        const refs : number[] = [];
        for(let i = 0; i < this.total_time; i++)
            refs.push(Math.round(Math.random() * this.number_of_pages - 1));
        return refs;
    }

    /**
     * Get the next reference from the list of references
     * @returns The next page number to be referenced
     */
    public nextReference() : number {
        const temp = this.references.reverse();
        const element = temp.pop();
        this.references = temp.reverse();
        return element;
    }

    /**
     * Check if the process computed time  is equals the total time
     */
    public hasFinished() : boolean {
        return this.total_time <= this.computed_time;
    }

    public toString() : string {
        return 'PID: ' + this.PID + '\nReferencias: ' + this.references.join(', ');
    }

}
