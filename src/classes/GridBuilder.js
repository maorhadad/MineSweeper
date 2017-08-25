import React from 'react';
import RowBuilder from './RowBuilder.js'

export default class GridBuilder extends React.Component{
    constructor(props){
        console.log("GridBuilder");
        super(props);
        this.resetGrid();
    }

    resetGrid = () =>{
        console.log("GridBuilder.resetGrid");
        var grid = this.fillRows();
        var mineList = this.deployMines(grid);
        grid = this.fillAdjacentMines(grid,mineList);
        this.state = {
            grid :  grid,
            gridMineList :  mineList,
            flagsRemaining :  this.props.numOfMines,
        };
    };

    fillRows = () =>{
        // console.log("GridBuilder.fillRows");
        var _grid = [];
        let numOfRows = this.props.numOfRows;
        let numOfCells = this.props.numOfCells;

        for(let row = 0 ; row < numOfRows ; row++){
            _grid.push([]);
            for(let col = 0; col < numOfCells ; col++){
                let cellDefaultData = {
                    id_x : row,
                    id_y: col,
                    hasMine: false,
                    isFlaged: false,
                    isOpen : false,
                    adjacent:0,
                    gameOverCallBack:this.props.onGameLose,
                };
                _grid[row].push(cellDefaultData);
            }
        }
        //console.log(_grid);
        //console.log("GridBuilder.fillRows end");
        return  _grid;
    };

    onCellOpend = (_cell) =>{
        let grid =  this.state.grid;
        this.floodFill(grid, _cell);
        this.setState({
            grid:grid,
        });
    };

    floodFill = (grid, cell) =>{

        if(cell.isOpen || cell.isFlaged){
            return;
        }

        if(cell.adjacent > 0 ){
            grid[cell.id_x][cell.id_y].isOpen = true;
            return;
        }

        let numOfRows = this.props.numOfRows;
        let numOfCells = this.props.numOfCells;

        grid[cell.id_x][cell.id_y].isOpen = true;


        //Go north
        let id_x =  cell.id_x - 1;
        let id_y =  cell.id_y;
        if(id_x >= 0){
            var nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go south
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y;
        if(id_x < numOfRows){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go west
        id_x =  cell.id_x;
        id_y =  cell.id_y - 1;
        if(id_y >= 0){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go east
        id_x =  cell.id_x;
        id_y =  cell.id_y + 1;
        if(id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go north west
        id_x =  cell.id_x - 1;
        id_y =  cell.id_y - 1;
        if(id_x >= 0 && id_y >= 0){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go south west
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y - 1;
        if(id_x < numOfRows && id_y >= 0){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go north east
        id_x =  cell.id_x - 1;
        id_y =  cell.id_y + 1;
        if(id_x >= 0 && id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }

        //Go south east
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y + 1;
        if(id_x < numOfRows && id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            this.floodFill(grid,nextCell);
        }
    };

    onCellExplode = (_cell) =>{

        var grid =  this.state.grid;
        grid[_cell.id_x][_cell.id_y].isOpen = true;

        //this.printGrid();
        this.setState({
            grid:grid,
        });
        this.props.onGameLose();
    };

    onCellFlagChange = (_cell) =>{

        var grid =  this.state.grid;
        var mineList =  this.state.gridMineList;

        var emptyMineList =  [];
        var flagsRemaining =  this.state.flagsRemaining;

        var isFlaged = _cell.isFlaged;
        var hasMine = _cell.hasMine;

        console.log("mineList length: " + mineList.length);
        if(!isFlaged){
            console.log("flaged");
            flagsRemaining--;
            if(hasMine){
                emptyMineList = mineList.filter( el=> {
                    return el.id_x !== _cell.id_x && el.id_y !== _cell.id_y;
                });
                mineList = emptyMineList.slice();
            }
        }else{
            console.log("un flaged");
            flagsRemaining++;
            if(hasMine){
                mineList.push(_cell);
            }
        }
        grid[_cell.id_x][_cell.id_y].isFlaged = !isFlaged;
        console.log("mineList length: " + mineList.length);
        this.setState({
            grid:grid,
            gridMineList:mineList,
            flagsRemaining:flagsRemaining,
        });
    };

    componentDidUpdate(){
        console.log("GridBuilder.componentDidUpdate");
        if(this.state.gridMineList.length === 0){
            this.props.onGameWin();
        }
    }

    printGrid = () => {
        for(let i = 0 ; i < this.state.grid.length ; i++){
            for (let j = 0 ; j < this.state.grid[i].length ; j++){
                console.log( this.state.grid[i][j]);
            }
        }
    };

    deployMines = (_grid) =>{
       // console.log(_grid);
        let numOfRows = this.props.numOfRows;
        let numOfCells = this.props.numOfCells;
        let mineList = [];
        let i = this.props.numOfMines;
        while(i){
            let randX = Math.floor(Math.random()*numOfRows);
            let RandY = Math.floor(Math.random()*numOfCells);
            let cell = _grid[randX][RandY];

            //console.log(cell);
            if(cell.hasMine === false){
                cell.hasMine = true;
                mineList.push(cell);
                i--;
            }
        }

        return mineList;
    };

    fillAdjacentMines = (grid,mineList) =>{
        //console.log("GridBuilder.fillAdjacentMines");
        let length = mineList.length;

        let gridNumOfRows = this.props.numOfRows;
        let gridNumOfCells = this.props.numOfCells;
        for(let i = 0 ; i <  length ; i++){
            let cell = mineList[i];
            let x = cell.id_x;
            let y = cell.id_y;
            //console.log("mine : x: " + x + " y: " + y);

            for(let x_t = x - 1; x_t <= x + 1 ; x_t++){

                if(x_t < 0 ){
                    continue;
                }

                if( x_t >= gridNumOfRows ){
                    continue;
                }

                for(let y_t = y - 1; y_t <= y + 1 ; y_t++){

                    if(y_t < 0 ){
                        continue;
                    }
                    if(y_t >= gridNumOfCells){
                        continue;
                    }
                    if((cell.id_x === x_t && cell.id_y === y_t)){
                        continue;
                    }
                    grid[x_t][y_t].adjacent++;
                }
            }
        }
        return grid;
    };

    render(){
        //console.log("GridBuilder.render");
        var gridUi = this.state.grid.map((row, index) => {
            return(
                <RowBuilder
                    key={index}
                    cells={row}
                    onCellOpend={this.onCellOpend}
                    onCellFlagChange={this.onCellFlagChange}
                    onCellExplode ={this.onCellExplode}
                />
            );
        });
        return (
            <div>
                <h10>Flags: {this.state.flagsRemaining}</h10>
                <table className="Grid">
                    <tbody>
                        {gridUi}
                    </tbody>
                </table>
            </div>

        );
    }
}