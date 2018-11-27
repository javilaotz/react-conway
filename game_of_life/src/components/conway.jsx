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
        let theGrid = this.state.theGrid;
        const ctx = this.refs.canvas.getContext('2d');      

        theGrid.map((row, row_index)=> {
            row.map((col, col_index) => {
                if(col===1){
                    console.log(`Col: ${col}`)
                    this.plotCell(ctx, col_index, row_index)
                }
            })
        })
        
        ctx.stroke();
 
    }
 
    //update the grid according to conway's rules
    updateGrid() { //perform one iteration of grid update
        let theGrid = this.state.theGrid
        let mirrorGrid = this.state.mirrorGrid
       
        console.log("mirrorGrid : ", mirrorGrid)
        for (var j = 1; j < this.state.height -1; j++) {
            for (var k = 1; k < this.state.width -1;  k++) {
                var totalCells = 0;
                //add up the total values for the surrounding cells
                totalCells += theGrid[j - 1][k - 1]; //top left
                totalCells += theGrid[j - 1][k]; //top center
                totalCells += theGrid[j - 1][k + 1]; //top right
 
                totalCells += theGrid[j][k - 1]; //middle left
                totalCells += theGrid[j][k + 1]; //middle right
 
                totalCells += theGrid[j + 1][k - 1]; //bottom left
                totalCells += theGrid[j + 1][k]; //bottom center
                totalCells += theGrid[j + 1][k + 1]; //bottom right
 
                //apply the rules to each cell
                switch (totalCells) {
                    case 2:
                        mirrorGrid[j][k] = theGrid[j][k];
 
                        break;
                    case 3:
                        mirrorGrid[j][k] = 1; //live
 
                        break;
                    default:
                        mirrorGrid[j][k] = 0; //
                }
            }
            for (var l = 0; l < this.state.height; l++) { //iterate through rows
                //top and bottom
                mirrorGrid[l][0] = mirrorGrid[l][this.state.height - 3];
                mirrorGrid[l][this.state.height - 2] = mirrorGrid[l][1];
                //left and right
                mirrorGrid[0][l] = mirrorGrid[this.state.height - 3][l];
                mirrorGrid[this.state.height - 2][l] = mirrorGrid[1][l];
            }
        }
 
        //swap grids
        var temp = theGrid;
        theGrid = mirrorGrid;
        mirrorGrid = temp;
 
        this.setState({theGrid : theGrid});
        this.setState({mirrorGrid : mirrorGrid});
    }
 
    tick() { //main loop
        this.updateGrid()
        this.plotGrid()
    }
 
    //plotting a live cell
    plotCell(ctx,x,y) {
        ctx.fillRect(x*10,y*10,10,10);
    }
 
    componentDidMount() {
        console.log(this.state.theGrid, "Recién creada")
        this.populateGrid()
        console.log(this.state.theGrid, "Antes de actualizar")
        this.plotGrid()        
        this.updateGrid()
        console.log(this.state.theGrid, "despues de actualizar")
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