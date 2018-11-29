import React, { Component } from 'react'
 
export default class conway extends Component {
    constructor(props){
        super(props);
        this.state = {
            theGrid: [...Array(50)].map(x => Array(50).fill(0)),
            mirrorGrid: [...Array(50)].map(x => Array(50).fill(0))
        }  
        this.updateGrid = this.updateGrid.bind(this)
        this.updateCellTheGrid = this.updateCellTheGrid.bind(this)
        this.plotCell = this.plotCell.bind(this)
        this.tick = this.tick.bind(this)
        this.action = this.action.bind(this)
    }
    
    //Set a cell into TheGrid according to x and y position
    updateCellTheGrid(x,y,cell){
        let theGrid = this.state.theGrid
        theGrid[x][y] = cell
  
        this.setState({theGrid:theGrid})
    }
    //if this works fine the exersice will be ok (control input)
    glider(){
        this.updateCellTheGrid(0,1,1)
        this.updateCellTheGrid(1,2,1)
        this.updateCellTheGrid(2,0,1)
        this.updateCellTheGrid(2,1,1)
        this.updateCellTheGrid(2,2,1)
    }
    //excersise seed
    seed(){
        this.updateCellTheGrid(0,0,1)
        this.updateCellTheGrid(0,1,1)
        this.updateCellTheGrid(1,0,1)
        this.updateCellTheGrid(1,3,1)
        this.updateCellTheGrid(2,1,1)
        this.updateCellTheGrid(2,2,1)
    }
 
    //Setting live cells
    populateGrid(){
        this.glider()
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
                return 0;
            })
            return 0;
        })
        
        ctx.stroke();
 
    }

    checkCell(x,y,grid,totalCells){
        if (x >= 0 && x <=49) {
            if (y >= 0 && y <=49) {
                totalCells += grid[x][y]
            }
        }
        return totalCells
    }
 
    //update the grid according to conway's rules
    updateGrid() { //perform one iteration of grid update
        let theGrid = this.state.theGrid || []
        let mirrorGrid = theGrid
        
        theGrid.map((row, row_index) => {
            row.map((item, col_index) => {
                    if (row_index === 2) {
                        //debugger
                    }    
                
                    let totalCells = 0;  //amount of live neghtbour
                    
                    //define position vars
                    let pos_x = col_index
                    let pos_y = row_index

                    //top left:
                    totalCells = this.checkCell(pos_x - 1, pos_y - 1, theGrid, totalCells)
                    //top center:
                    totalCells = this.checkCell(pos_x, pos_y - 1, theGrid, totalCells)
                    //top right:
                    totalCells = this.checkCell(pos_x + 1, pos_y - 1, theGrid, totalCells)

                    //middle left:
                    totalCells = this.checkCell(pos_x - 1, pos_y, theGrid, totalCells)
                    //middle center:
                    //not necessary, current cell position
                    //middle right:
                    totalCells = this.checkCell(pos_x + 1, pos_y, theGrid, totalCells)

                    //top left:
                    totalCells = this.checkCell(pos_x - 1, pos_y + 1, theGrid, totalCells)
                    //top center:
                    totalCells = this.checkCell(pos_x, pos_y + 1, theGrid, totalCells)
                    //top right:
                    totalCells = this.checkCell(pos_x + 1, pos_y + 1, theGrid, totalCells)
                   
                    /*
                    Any live cell with fewer than two live neighbors dies, as if by underpopulation.
                    Any live cell with two or three live neighbors lives on to the next generation.
                    Any live cell with more than three live neighbors dies, as if by overpopulation.
                    Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
                    */
                    switch (totalCells) {
                        case totalCells < 2 :
                            if (item===1) {
                                mirrorGrid[pos_x][pos_y] = 0 //Dies by underpopulation  
                            }
                            break;
                        case totalCells===2:  
                            if (item===1) {
                                mirrorGrid[pos_x][pos_y] = 1 //Lives
                            }                            
                            break;
                        case totalCells===3:  
                                mirrorGrid[pos_x][pos_y] = 1 //Lives by reproduction or pass to the next generation              
                            break;
                        case totalCells > 3 :   
                            if (item===1) {
                                mirrorGrid[pos_x][pos_y] = 0 //Dies by overpopulation
                            }                         
                            break;
                        default:
                            if (item===0) {
                                mirrorGrid[pos_x][pos_y] = 0                                
                            }
                    }
                    return 0;
                
            })
            return 0;
        })
        this.setState({theGrid : mirrorGrid})
    }
 
    tick() { //main loop
        this.updateGrid()
        this.plotGrid()
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
    
    //Play button action
    action(){
        this.interval = setInterval(this.tick, 1000);
    }
 
    componentDidMount() {
        this.populateGrid()
        this.plotGrid()     
    }    
    componentWillMount(){
        clearInterval(this.interval)
    }
 
    render() {
        return (
        <div>
            <h1>Conway's game of life</h1>
           <canvas ref="canvas" width={500} height={500}  />
           <button onClick={this.tick}>Step</button>
           <button onClick={this.action}>Play (1 sec)</button>
       </div>
       )
   }
}