import CPU from './cpu';
import PhysicalMemory from './physical_memory';


const cpu = new CPU([]);

for(let i = 0; i < 20; i++)
    if(!cpu.next())
       break; 


// const physical = new PhysicalMemory(5);
// physical.loadPage('A', 0);
// physical.loadPage('A', 1);
// physical.loadPage('A', 2);
// physical.loadPage('A', 3);
// physical.loadPage('A', 4);

// physical.refProcessPage('A', 3);

// console.log(physical.toString());

// physical.releaseFrame('A', 2);
// console.log(physical.isFull());
// physical.loadPage('A', 7);
// console.log(physical.isFull());
// console.log(physical.toString());


// CPU  pseudocode workflow      

/* 
- El cpu pregunta al loader si hay procesos a entrar en el tiempo de ejecucion actual n
- Si los hay, registra el proceso en el scheduler, y lo carga en memoria. <?>(directamente o por algoritmo)
- El cpu le pregunta el scheduler el siguiente proceso en ser ejecutado segun el algoritmo (En esta caso fifo)
- Si hay algun proceso para ejecutar, se toma y se manda a hacer referencia a su siguiente marco de pagina.
- Se aumenta el timepo se ejecucion y se repite el ciclo.
*/

//Loader workflow

/*
- Se inicializa con un arreglo con la informacion correspondiente a los procesos a utilizar en el simulador
  procesandolo y obteniendo a partir de este un objeto con el tiempo de arrivo como clave, y como valor un 
  arreglo que contrendra todos los procesos que tengan el mismo tiempo de arrvio que la clave.
- Se ira retornando el arreglo de procesos segun su clave, si es que existe en el objeto, de no ser asi
  se retornara un arreglo vacio.
*/

