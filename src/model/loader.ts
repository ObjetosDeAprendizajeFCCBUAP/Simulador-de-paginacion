import Process from './process';
import RoundRobin from './rr_scheduler';   

export interface IProcessInput {
  pid : string;
  arrival_time : number;
  total_time : number;
  pages: number;
  references? : number[];
}

type sortedProcDic = { [index: number]: IProcessInput[]};

export default class Loader {

  input: IProcessInput[];
  sortedProcesses: sortedProcDic;

  constructor(input: IProcessInput[]){
    this.input = input;
    this.sortedProcesses = {} as sortedProcDic;
    this.processInput(input);
  }

  private processInput(input: IProcessInput[]): void {
    this.input = input.sort((a, b) => a.arrival_time - b.arrival_time);
    console.log(this.input);
    this.input.forEach(e => {
      if(this.sortedProcesses[e.arrival_time])
        this.sortedProcesses[e.arrival_time].push(e);
      else
        this.sortedProcesses[e.arrival_time] = [e];
    });
    console.log(this.sortedProcesses);
  }

  public tick(time: number): IProcessInput[] {
    return this.sortedProcesses[time] ? this.sortedProcesses[time] : [];
  }

}
