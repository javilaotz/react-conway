import React, { Component } from 'react'

export default class conway extends Component {
    constructor(props){
        super(props);
        this.state = {
            conways_grid: [],
            height:50,
            width:50
        }        
    }

    //Creates a 2 dimensional array
    createArray(rows) { 
        var arr = [];
        for (var i = 0; i < rows; i++) {
            arr[i] = [];
        }
        this.setState({
            conways_grid: this.state.conways_grid.push.apply(this.state.conways_grid, arr)
        })
    }

    //Default population, all cells are dead
    defaultPopulation(){
        var theGrid = this.state.conways_grid;
        
        for (var j = 0; j < this.state.height; j++) { //iterate through rows
            for (var k = 0; k < this.state.width; k++) { //iterate through columns
                theGrid[j][k] = 0;
            }
        }

        this.forceUpdate();

    }

    //Setting live cells
    populateCanvas(){
        var theGrid = this.state.conways_grid;

        theGrid[0][0] = 1;
        theGrid[0][1] = 1;
        theGrid[1][0] = 1;
        theGrid[1][3] = 1;
        theGrid[2][1] = 1;
        theGrid[2][2] = 1;

        this.forceUpdate();
        
    }

    //Plot Grid
    plotGrid() {
        var theGrid = this.state.conways_grid;
        var liveCount = 0;
        for (var j = 0; j < this.state.height; j++) {
            for (var k = 0; k < this.state.width; k++) {
                if (theGrid[j][k] === 1) {
                    console.log("plotting live cell at (" + j + ", " + k +")")
                    this.plotCell(j, k);
                    liveCount++;
                }
            }
        }
    }

    //update the grid according to conway's rules
    updateGrid() { //perform one iteration of grid update
        var theGrid = this.state.conways_grid;
        var mirrorGrid = theGrid

        for (var j = 1; j < this.state.height -1; j++) { //iterate through rows
            for (var k = 1; k < this.state.width -1;  k++) { //iterate through columns
                console.log("Iterating at ("+j+", "+k+")")
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
        }

        for (var l = 0; l < this.state.height; l++) { //iterate through rows
            //top and bottom
            mirrorGrid[l][0] = mirrorGrid[l][this.state.height - 3];
            mirrorGrid[l][this.state.height - 2] = mirrorGrid[l][1];
            //left and right
            mirrorGrid[0][l] = mirrorGrid[this.state.height - 3][l];
            mirrorGrid[this.state.height - 2][l] = mirrorGrid[1][l];

        }


        //swap grids
        var temp = theGrid;
        theGrid = mirrorGrid;
        mirrorGrid = temp;
    }

    tick() { //main loop
        this.updateGrid();
        this.plotGrid();
    }


    //plotting a live cell
    plotCell(x,y) {
        const ctx = this.refs.canvas.getContext('2d');
        ctx.fillRect(x*10,y*10,10,10);
    }

    componentDidMount() {
        this.createArray(this.state.height);
        this.defaultPopulation();
        this.populateCanvas();
        this.plotGrid();

        setTimeout(this.tick(), 1000);
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
