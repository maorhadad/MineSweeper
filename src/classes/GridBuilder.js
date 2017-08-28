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
        console.log("GridBuilder.initGrid");

        var gtg = this.generateGrid(numOfRows, numOfCells, numOfMines);
        var grid = gtg.grid;
        var mineList = gtg.mines;
        console.log(mineList);
        this.state = {
            grid :  grid,
            gridMineList :  mineList,
            superman: false,
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
                    gameOverCallBack:this.props.onGameLose,
                };
                _grid[row].push(cellDefaultData);
            }
        }
        //console.log(_grid);
        //console.log("GridBuilder.fillRows end");
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

    // componentWillReceiveProps = (nextProps) => {
    //     console.log("GridBuilder componentWillReceiveProps");
    //     console.log("nextProps.numOfRows: " + nextProps.numOfRows);
    //     var grid = this.generateGrid(nextProps.numOfRows, nextProps.numOfCells, nextProps.numOfMines);
    //     this.setState({
    //             grid :  grid,
    //             numOfRows: nextProps.numOfRows,
    //             numOfCells: nextProps.numOfCells,
    //             numOfMines : nextProps.numOfMines,
    //             flagsRemaining : nextProps.numOfMines,
    //             remainingMinesToFlag : nextProps.remainingMinesToFlag,
    //         }
    //     );
    // };

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

                    if(i === currentCell.id_x && j === currentCell.id_y){//Same cell.We don't need to reenter it.(Infinity loop)
                        continue
                    }
                    if( j < 0 || j >= numOfCells) {//Out of bounds
                        continue;
                    }
                    let tCell = _grid[i][j];


                    if(tCell.isFlaged || tCell.hasMine){
                        continue;
                    }

                    if(1 === tCell.id_x && 28 === tCell.id_y){
                        console.log("above !tCell.isOpen :"  + tCell.id_x + " " + tCell.id_y);
                    }

                    if(!tCell.isOpen){
                        if(1 === tCell.id_x && 28 === tCell.id_y){
                            console.log("in tcell !tCell.isOpen :"  + tCell.id_x + " " + tCell.id_y);
                        }
                        this.openCell(_grid,tCell);
                        if(cellsQ.length < 100){
                            cellsQ.push(tCell);
                        }
                    }
                }
            }
        }
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
        if(flagsRemaining === 0){//User finish all its flag.
            return;
        }
        let isFlaged = _cell.isFlaged;
        let hasMine = _cell.hasMine;

        console.log("remainingMinesToFlag length: " + remainingMinesToFlag);
        if(!isFlaged){
            console.log("flaged");
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
        grid[_cell.id_x][_cell.id_y].isFlaged = !isFlaged;

        console.log("mineList length: " + remainingMinesToFlag);
        this.changeCellFlagState(grid,_cell);
        this.setState({
            remainingMinesToFlag:remainingMinesToFlag,
            flagsRemaining:flagsRemaining,
        });
        if(remainingMinesToFlag === 0){
            this.props.onGameWin();
        }
    };

    changeCellFlagState = (_grid, cell) =>{
        _grid[cell.id_x][cell.id_y].isOpen = true;
        let index_ref = this.buildReferenceId(cell.id_x , cell.id_y);//getting reference to cell
        let cellRef = this.refs[index_ref];
        cellRef.setFlaged(true);
    };

    onCellExplode = (_cell) =>{

        var grid =  this.state.grid;
        grid[_cell.id_x][_cell.id_y].isOpen = true;
        this.openCell(grid,_cell);
        this.props.onGameLose();
    };

    /*
       * It cause to RangeError: Maximum call stack size exceeded.
       * Now it #ForestFire.
       * */
    floodFill = (grid, cell) =>{

        if(cell.isOpen || cell.isFlaged){
            return;
        }
        var index_ref = this.buildReferenceId(cell.id_x , cell.id_y);
        let cellRef = this.refs[index_ref];
        if(cell.adjacent > 0 ){

            grid[cell.id_x][cell.id_y].isOpen = true;
            cellRef.setOpen(true);

            return;
        }

        let numOfRows = this.state.numOfRows;
        let numOfCells = this.state.numOfCells;

        grid[cell.id_x][cell.id_y].isOpen = true;
        cellRef.setOpen(true);

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

    render(){
        console.log("GridBuilder.render");
        var gridUi = this.state.grid.map((row, index_x) => {
            var v = row.map((cell, index_y) => {
                var index_ref = this.buildReferenceId(index_x , index_y);
                return (

                    <Cell
                        ref={index_ref}
                        key={index_y}
                        cell={cell}
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

    setGridSuperMan = (isSuperMan) =>{
        console.log("setGridSuperMan: " + isSuperMan);
        let mines = this.state.gridMineList;
        let length = mines.length;
        for(let i = 0 ; i < length ; i++){
            let cell = mines[i];
            console.log(cell);
            let index_ref = this.buildReferenceId(cell.id_x , cell.id_y);//getting reference to cell
            let cellRef = this.refs[index_ref];
            cellRef.setSuperMan(isSuperMan);
        }
        console.log(mines);
    };
}