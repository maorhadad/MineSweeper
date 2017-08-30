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

    initGrid = (numOfRows, numOfCells, numOfMines) =>{
        var gtg = this.generateGrid(numOfRows, numOfCells, numOfMines);
        var grid = gtg.grid;
        var mineList = gtg.mines;
        console.log(mineList);
        this.state = {
            grid :  grid,
            gridMineList :  mineList,
            numOfRows: numOfRows,
            numOfCells: numOfCells,
            numOfMines : numOfMines,
            flagsRemaining : numOfMines,
            remainingMinesToFlag : numOfMines,
        };
    };

    generateGrid = (numOfRows, numOfCells, numOfMines) =>{
        let grid = this.fillRows(numOfRows, numOfCells);
        let mineList = this.deployMines(grid, numOfRows, numOfCells,numOfMines);
        grid = this.fillAdjacentMines(grid,mineList, numOfRows, numOfCells);
        return {
            mines: mineList,
            grid:grid
        }
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
                    superman: this.props.superman,
                    gameOverCallBack:this.props.onGameLose,
                };
                _grid[row].push(cellDefaultData);
            }
        }
        return  _grid;
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
        for(let i = 0 ; i <  length ; i++){
            let cell = mineList[i];
            let x = cell.id_x;
            let y = cell.id_y;
            //console.log("mine : x: " + x + " y: " + y);

            for(let x_t = x - 1; x_t <= x + 1 ; x_t++){

                if(x_t < 0 ){
                    continue;
                }

                if( x_t >= numOfRows ){
                    continue;
                }

                for(let y_t = y - 1; y_t <= y + 1 ; y_t++){

                    if(y_t < 0 ){
                        continue;
                    }
                    if(y_t >= numOfCells){
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

    onCellOpen = (_cell) =>{
        let grid =  this.state.grid;
        this.forestFire(grid, _cell);
    };

    forestFire = (_grid, _cell) =>{

        let cellsQ = [];
        let numOfRows = this.state.numOfRows;
        let numOfCells = this.state.numOfCells;
        cellsQ.push(_cell);
        console.log("cellsQ length: " + cellsQ.length);
        while (cellsQ.length){
            if(cellsQ.length === numOfCells*numOfRows){
                return;
            }
            //console.log("length : " + cellsQ.length);
            let currentCell = cellsQ[0];
            cellsQ.splice(0,1);
            if(currentCell.adjacent > 0 ){
                this.openCell(_grid,currentCell);
                continue;
            }

            let minX = currentCell.id_x - 1; // top left
            let minY = currentCell.id_y - 1;

            let maxX = currentCell.id_x + 1; // bottom right
            let maxY = currentCell.id_y + 1;

            for(let i = minX ; i <= maxX ; i++){
                //console.log("X: " + i);
                if( i < 0 || i >= numOfRows) {//Out of bounds
                    continue;
                }
                for(let j = minY ; j <= maxY ; j ++){
                    //console.log("X: " + i + " Y :" + j);

                    if( j < 0 || j >= numOfCells) {//Out of bounds
                        continue;
                    }
                    let tCell = _grid[i][j];


                    if(tCell.isFlaged || tCell.hasMine){
                        continue;
                    }

                    if(!tCell.isOpen){
                        this.openCell(_grid,tCell);
                        if(cellsQ.length < 100){
                            cellsQ.push(tCell);
                        }
                    }
                }
            }
        }
    };

    validateState = (gridDataCell, cell) =>{
        gridDataCell.isOpen = cell.isOpen;
    };

    openCell = (_grid, cell) =>{
        _grid[cell.id_x][cell.id_y].isOpen = true;
        let index_ref = this.buildReferenceId(cell.id_x , cell.id_y);//getting reference to cell
        let cellRef = this.refs[index_ref];
        cellRef.setOpen(true);
    };

    onCellFlagChange = (_cell) =>{

        let grid =  this.state.grid;
        //var mineList =  this.state.gridMineList;
        let remainingMinesToFlag =  this.state.remainingMinesToFlag;

        //var emptyMineList =  [];
        let flagsRemaining =  this.state.flagsRemaining;

        let isFlaged = _cell.isFlaged;
        let hasMine = _cell.hasMine;

        console.log("remainingMinesToFlag length: " + remainingMinesToFlag);
        if(!isFlaged){
            console.log("flaged");
            if(flagsRemaining === 0){//User finish all its flag.
                return;
            }
            flagsRemaining--;
            if(hasMine){
                remainingMinesToFlag--;
            }
        }else{
            console.log("un flaged");
            flagsRemaining = flagsRemaining + 1;
            if(hasMine){
                remainingMinesToFlag = remainingMinesToFlag + 1;
            }
        }

        console.log("mineList length: " + remainingMinesToFlag);
        this.changeCellFlagState(grid,_cell,!isFlaged);
        this.setState({
            remainingMinesToFlag:remainingMinesToFlag,
            flagsRemaining:flagsRemaining,
        });
        if(remainingMinesToFlag === 0){
            this.props.onGameWin();
        }
    };

    changeCellFlagState = (_grid, _cell, newState) =>{
        _grid[_cell.id_x][_cell.id_y].isFlaged = newState;
        let index_ref = this.buildReferenceId(_cell.id_x , _cell.id_y);//getting reference to cell
        let cellRef = this.refs[index_ref];
        cellRef.setFlaged(newState);
    };

    onCellExplode = (_cell) =>{

        var grid =  this.state.grid;
        grid[_cell.id_x][_cell.id_y].isOpen = true;
        this.openCell(grid,_cell);
        this.props.onGameLose();
    };

    render(){
        console.log("GridBuilder.render");
        console.log("superman: " + this.props.superman);
        var gridUi = this.state.grid.map((row, index_x) => {
            var v = row.map((cell, index_y) => {
                var index_ref = this.buildReferenceId(index_x , index_y);
                return (

                    <Cell
                        ref={index_ref}
                        key={index_y}
                        cell={cell}
                        superman={this.props.superman}
                        onCellOpen={this.onCellOpen}
                        onCellFlagChange={this.onCellFlagChange}
                        onCellExplode={this.onCellExplode}
                    />
                );
            });
            return(
                <tr className="trc"   key={index_x}>{v}</tr>
            );
        });
        return (
            <div>
                <h10>Flags: {this.state.flagsRemaining}</h10>
                <table className="Grid" ref="gridUiRef">
                    <tbody className="GridBody">
                        {gridUi}
                    </tbody>
                </table>
            </div>

        );
    }

    buildReferenceId = (index_x , index_y) =>{
        return "cell_"+ index_x+ "," + index_y;
    };
}