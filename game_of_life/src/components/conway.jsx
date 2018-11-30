import React, { Component } from 'react'
import { Row, Col, Container, Button } from 'reactstrap'
 
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
                totalCells += grid[y][x]
            }
        }
        return totalCells
    }
 
    //update the grid according to conway's rules
    updateGrid() { //perform one iteration of grid update
        let theGrid = this.state.theGrid || []
        let mirrorGrid = [...Array(50)].map(x => Array(50).fill(0))
        
        theGrid.map((row, row_index) => {
            row.map((item, col_index) => {
                    
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
                    //middle right:
                    totalCells = this.checkCell(pos_x + 1, pos_y, theGrid, totalCells)

                    //bottom left:
                    totalCells = this.checkCell(pos_x - 1, pos_y + 1, theGrid, totalCells)
                    //bottom center:
                    totalCells = this.checkCell(pos_x, pos_y + 1, theGrid, totalCells)
                    //bottom right:
                    totalCells = this.checkCell(pos_x + 1, pos_y + 1, theGrid, totalCells)
                    
                    if (totalCells < 2) {
                        mirrorGrid[pos_x][pos_y] = 0 //Dies by underpopulation 
                    }
                    
                    if(totalCells === 2){
                        if (item===1) { //Is alive?
                            mirrorGrid[pos_x][pos_y] = 1 //Lives
                        }  
                    } 
                    
                    if(totalCells === 3){
                        mirrorGrid[pos_x][pos_y] = 1 //Lives by reproduction or pass to the next generation                
                    } 
                    
                    if(totalCells > 3){
                        mirrorGrid[pos_x][pos_y] = 0 //Dies by overpopulation
                    }
                    //return console.log("ending 1");
            })
            //return console.log("ending 2");
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
        ctx.fillStyle="#EEE";
        ctx.fillRect(x*10,y*10,10,10);
    }   
    
    //Play button action
    action(){
        this.interval = setInterval(this.tick, 200);
    }

    //draw a background grid into the canvas
    backgroundGrid(){
        const ctx = this.refs.canvas.getContext('2d');     
        let x = 10
        let y = 10
        let w = 500
        let h = 500
        ctx.canvas.width  = w;
        ctx.canvas.height = h;
        
        
        for (x=0;x<=w;x+=10) {
            for (y=0;y<=h;y+=10) {
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
            }
        }
        ctx.strokeStyle="#EEEEEE";
        ctx.lineWidth=2;
        ctx.stroke();
    }
 
    componentDidMount() {
        this.backgroundGrid()
        this.populateGrid()
        this.plotGrid()     
        //this.interval = setInterval(this.tick, 1000);
    }    
    componentWillMount(){
        clearInterval(this.interval)
    }
 
    render() {
        return (
        <div>
            <Container>
                <Row>
                    <Col><h1>Conway's game of life</h1></Col>
                </Row>
                <Row>
                    <Col><canvas ref="canvas" width={500} height={500}  /></Col>
                </Row>
                <Row>
                    <Col sm={{ size: 'small', offset: 1 }}><Button color="primary" onClick={this.tick}>Step</Button></Col>
                    <Col sm={{ size: 'small', offset: 1 }}><Button color="success" onClick={this.action}>Play</Button></Col>
                </Row>
            </Container>
       </div>
       )
   }
}