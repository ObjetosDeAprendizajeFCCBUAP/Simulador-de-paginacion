export default class Process {

    PID             : string;
    references      : number[];
    computed_time   : number;
    total_time      : number;
    number_of_pages : number;

    constructor(pid : string, total_time : number, number_of_pages : number, references? : number[] ){
        this.PID                = pid;
        this.total_time         = total_time;
        this.number_of_pages    = number_of_pages;
        this.references         = references || this.createRandomReferences();
        this.computed_time      = 0;
    }

    private createRandomReferences() : number[] {
        const refs : number[] = [];
        for(let i = 0; i < this.total_time; i++)
            refs.push(this.random(this.number_of_pages - 1));
        return refs;
    }

    private random(limit = 100) : number {
        return Math.round(Math.random() * limit);
    }
    
    public nextReference() : number {
        const temp = this.references.reverse();
        const element = temp.pop();
        this.references = temp.reverse();
        return element;
    }

    public hasFinished() : boolean {
        return this.total_time <= this.computed_time;
    }

    public toString() : string {
        return 'PID: ' + this.PID + '\nReferencias: ' + this.references.join(', ');
    }

}
