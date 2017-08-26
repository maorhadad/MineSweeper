import React from 'react';
import Cell from './Cell.js'

export default class GridBuilder extends React.Component{
    constructor(props){
        console.log("GridBuilder");
        super(props);
        this.state = {
            numOfRows: props.numOfRows,
            numOfCells: props.numOfCells,
            numOfMines : props.numOfMines,
            flagsRemaining :  props.numOfMines,
            remainingMinesToFlag :  props.numOfMines
        };
        this.initGrid(props.numOfRows, props.numOfCells, props.numOfMines);
    }

    generateGrid = (numOfRows, numOfCells, numOfMines) =>{
        var grid = this.fillRows(numOfRows, numOfCells);
        var mineList = this.deployMines(grid, numOfRows, numOfCells,numOfMines);
        grid = this.fillAdjacentMines(grid,mineList, numOfRows, numOfCells);
        return grid;
    }

    initGrid = (numOfRows, numOfCells, numOfMines) =>{
        console.log("GridBuilder.resetGrid");
        var grid = this.generateGrid(numOfRows, numOfCells, numOfMines);
        this.state = {
            grid :  grid,
            //gridMineList :  mineList,

            numOfRows: numOfRows,
            numOfCells: numOfCells,
            numOfMines : numOfMines,
            flagsRemaining : numOfMines,
            remainingMinesToFlag : numOfMines,
        };
    };

    componentWillReceiveProps = (nextProps) => {
        console.log("GridBuilder componentWillReceiveProps");
        console.log("nextProps.numOfRows: " + nextProps.numOfRows);
        var grid = this.generateGrid(nextProps.numOfRows, nextProps.numOfCells, nextProps.numOfMines);
        console.log(grid);
        //var mineList = this.deployMines(grid, nextProps.numOfRows, nextProps.numOfCells, nextProps.numOfMines);
        //grid = this.fillAdjacentMines(grid,mineList, nextProps.numOfRows, nextProps.numOfCells);
        this.setState({
                grid :  grid,
                numOfRows: nextProps.numOfRows,
                numOfCells: nextProps.numOfCells,
                numOfMines : nextProps.numOfMines,
                flagsRemaining : nextProps.numOfMines,
                remainingMinesToFlag : nextProps.remainingMinesToFlag,
            }
        );

        // this.setState ({
        //     grid :  this.generateGrid(nextProps.numOfRows, nextProps.numOfCells, nextProps.numOfMines),
        //     numOfRows: nextProps.numOfRows,
        //     numOfCells: nextProps.numOfCells,
        //     numOfMines : nextProps.numOfMines,
        //     flagsRemaining : nextProps.numOfMines,
        //     remainingMinesToFlag : nextProps.remainingMinesToFlag,
        // });
    };

    resetGrid = () =>{
        console.log("GridBuilder.resetGrid");

    };

    fillRows = (numOfRows, numOfCells) =>{
        // console.log("GridBuilder.fillRows");
        var _grid = [];

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

        let numOfRows = this.state.numOfRows;
        let numOfCells = this.state.numOfCells;

        grid[cell.id_x][cell.id_y].isOpen = true;


        //Go north
        let id_x =  cell.id_x - 1;
        let id_y =  cell.id_y;
        if(id_x >= 0){
            var nextCell = grid[id_x][id_y];
            console.log(id_x+"");
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid, nextCell);

        }

        //Go south
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y;
        if(id_x < numOfRows){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go west
        id_x =  cell.id_x;
        id_y =  cell.id_y - 1;
        if(id_y >= 0){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go east
        id_x =  cell.id_x;
        id_y =  cell.id_y + 1;
        if(id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go north west
        id_x =  cell.id_x - 1;
        id_y =  cell.id_y - 1;
        if(id_x >= 0 && id_y >= 0){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go south west
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y - 1;
        if(id_x < numOfRows && id_y >= 0){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go north east
        id_x =  cell.id_x - 1;
        id_y =  cell.id_y + 1;
        if(id_x >= 0 && id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
                this.floodFill(grid,nextCell);
        }

        //Go south east
        id_x =  cell.id_x + 1;
        id_y =  cell.id_y + 1;
        if(id_x < numOfRows && id_y < numOfCells){
            nextCell = grid[id_x][id_y];
            //if( !(nextCell.isOpen && nextCell.isFlaged))
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
        //var mineList =  this.state.gridMineList;
        var remainingMinesToFlag =  this.state.remainingMinesToFlag;

        //var emptyMineList =  [];
        var flagsRemaining =  this.state.flagsRemaining;

        var isFlaged = _cell.isFlaged;
        var hasMine = _cell.hasMine;

        console.log("remainingMinesToFlag length: " + remainingMinesToFlag);
        if(!isFlaged){
            console.log("flaged");
            flagsRemaining--;
            if(hasMine){
                remainingMinesToFlag--;
                // emptyMineList = mineList.filter( el=> {
                //     return el.id_x !== _cell.id_x && el.id_y !== _cell.id_y;
                // });
                // mineList = emptyMineList.slice();
            }
        }else{
            console.log("un flaged");
            flagsRemaining++;
            if(hasMine){
                remainingMinesToFlag++;
               // mineList.push(_cell);
            }
        }
        grid[_cell.id_x][_cell.id_y].isFlaged = !isFlaged;
        console.log("mineList length: " + remainingMinesToFlag);
        this.setState({
            grid:grid,
            remainingMinesToFlag:remainingMinesToFlag,
            flagsRemaining:flagsRemaining,
        });
    };

    componentDidUpdate(){
        console.log("GridBuilder.componentDidUpdate");
        console.log("GridBuilder.componentDidUpdate");
        if(this.state.remainingMinesToFlag === 0){
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

    deployMines = (_grid, numOfRows, numOfCells, numOfMines) =>{
       // console.log(_grid);
        let mineList = [];
        let i = numOfMines;
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

    fillAdjacentMines = (grid,mineList, numOfRows, numOfCells) =>{
        //console.log("GridBuilder.fillAdjacentMines");
        let length = mineList.length;

        let gridNumOfRows = numOfRows;
        let gridNumOfCells = numOfCells;
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
        console.log("GridBuilder.render");
        var gridUi = this.state.grid.map((row, index) => {
            var v = row.map((cell, index) => {
                return (

                    <Cell
                        key={index}
                        cell={cell}
                        onCellOpend={this.onCellOpend}
                        onCellFlagChange={this.onCellFlagChange}
                        onCellExplode={this.onCellExplode}
                    />

                );
            });
            return(
                <tr className="trc" key={index}>{v}</tr>
            );
        });
        return (
            <div>
                <h10>Flags: {this.state.flagsRemaining}</h10>
                <table className="Grid">
                    <tbody className="GridBody">
                        {gridUi}
                    </tbody>
                </table>
            </div>

        );
    }
}