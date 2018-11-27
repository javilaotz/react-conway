import React, { Component } from 'react'
 
export default class conway extends Component {
    constructor(props){
        super(props);
        this.state = {
            height:50,
            width:50,
            theGrid: [...Array(50)].map(x => Array(50).fill(0)),
            mirrorGrid: [...Array(50)].map(x => Array(50).fill(0))
        }  
        this.updateGrid = this.updateGrid.bind(this)
        this.updateTheGrid = this.updateTheGrid.bind(this)
        this.plotCell = this.plotCell.bind(this)
    }
 
    //Set a cell into TheGrid according to x and y position
    updateTheGrid(x,y,cell){
        let theGrid = {...this.state.theGrid}
        theGrid[x][y] = cell
        let newGrid = {...this.state, typeElements: {theGrid} }
  
        this.setState({theGrid:newGrid})
    }
 
    //Setting live cells
    populateGrid(){
        this.updateTheGrid(0,0,1)
        this.updateTheGrid(0,1,1)
        this.updateTheGrid(1,0,1)
        this.updateTheGrid(1,3,1)
        this.updateTheGrid(2,1,1)
        this.updateTheGrid(2,2,1)
    }
 
    //Plot Grid
    plotGrid() {
        let theGrid = this.state.theGrid
        const ctx = this.refs.canvas.getContext('2d');      

        theGrid.map((row, row_index)=> {
            row.map((col, col_index) => {
                if(col===1){
                    this.plotCell(ctx, col_index, row_index)
                }else{
                    this.killCell(ctx, col_index, row_index)
                }
            })
        })
        
        ctx.stroke();
 
    }
 
    //update the grid according to conway's rules
    updateGrid() { //perform one iteration of grid update
        let theGrid = this.state.theGrid
        let mirrorGrid = {...this.state.mirrorGrid}
       
        console.log("theGrid : ", theGrid)
        console.log("mirrorGrid : ", mirrorGrid)
        theGrid.map((row, row_index)=> {
            row.map((item, col_index) => {
                if(item===1){
                    console.log(`POS[${col_index}][${row_index}]: ${item}`)
                    let totalCells = 0; 
                    
                    //define position vars
                    let pos_x = col_index
                    let pos_y = row_index

                    //top left:
                    if (pos_x-1 >= 0) {
                        if (pos_y-1 >= 0) {
                            console.log(`[TL] => the position ${pos_x-1}, ${pos_y-1} exist`)
                            totalCells += theGrid[pos_x-1][pos_y-1]
                        }
                    }
                    //top center:
                    if (pos_x-1 >= 0) {
                        if (pos_y >= 0) {
                            console.log(`[TC] => the position ${pos_x-1}, ${pos_y} exist`)
                            totalCells += theGrid[pos_x-1][pos_y]
                        }
                    }
                    //top right:
                    if (pos_x-1 >= 0) {
                        if (pos_y+1 >= 0) {
                            console.log(`[TR] => the position ${pos_x-1}, ${pos_y+1} exist`)
                            totalCells += theGrid[pos_x-1][pos_y+1]
                        }
                    }
                    //middle left:
                    if (pos_x >= 0) {
                        if (pos_y-1 >= 0) {
                            console.log(`[ML] => the position ${pos_x}, ${pos_y-1} exist`)
                            totalCells += theGrid[pos_x][pos_y-1]
                        }
                    }
                    //middle right:
                    if (pos_x >= 0) {
                        if (pos_y+1 >= 0) {
                            console.log(`[MR] => the position ${pos_x}, ${pos_y+1} exist`)
                            totalCells += theGrid[pos_x][pos_y+1]
                        }
                    }
                    //bottom left:
                    if (pos_x+1 >= 0) {
                        if (pos_y-1 >= 0) {
                            console.log(`[BL] => the position ${pos_x+1}, ${pos_y-1} exist`)
                            totalCells += theGrid[pos_x+1][pos_y-1]
                        }
                    }
                    //bottom center:
                    if (pos_x+1 >= 0) {
                        if (pos_y >= 0) {
                            console.log(`[BC] => the position ${pos_x+1}, ${pos_y} exist`)
                            totalCells += theGrid[pos_x+1][pos_y]
                        }
                    }
                    //bottom right:
                    if (pos_x+1 >= 0) {
                        if (pos_y+1 >= 0) {
                            console.log(`[BR] => the position ${pos_x+1}, ${pos_y+1} exist`)
                            totalCells += theGrid[pos_x+1][pos_y+1]
                        }
                    }

                    console.log(`[Result] The Total of live cell around this live cell is ${totalCells}`)


                    /*
                    Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                    Any live cell with two or three live neighbors lives on to the next generation.
                    Any live cell with more than three live neighbors dies, as if by overpopulation.
                    Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                    */

                   switch (totalCells) {
                        case 2 || 3:
                            theGrid[pos_x][pos_y] = 1 //Lives by underpopulation
                            break;
                        case totalCells > 3:
                            theGrid[pos_x][pos_y] = 0 //Dies by overpopulation 
                            break;
                        default:
                            theGrid[pos_x][pos_y] = 0; //
                    }

                }
            })
        })

        console.log(`Grid resultante: ${theGrid}`)
        let newGrid = {...this.state, typeElements: {theGrid} }
        this.setState({theGrid : newGrid})
    }
 
    tick() { //main loop
        setInterval(() => {
            this.updateGrid()
            this.plotGrid()
        }, 1000);
    }
 
    //plotting a live cell
    plotCell(ctx,x,y) {
        ctx.fillStyle="#000";
        ctx.fillRect(x*10,y*10,10,10);
    }

    //plotting a dead cell
    killCell(ctx,x,y) {
        ctx.fillStyle="#FFF";
        ctx.fillRect(x*10,y*10,10,10);
    }    
 
    componentDidMount() {
        this.populateGrid()
        this.plotGrid() 
        this.tick()
    }    
 
    render() {
        
        return (
        <div>
            <h1>Conway's game of life</h1>
           <canvas ref="canvas" width={500} height={500}  />
       </div>
       )
   }
}