import React from 'react';
import GridBuilder from './GridBuilder.js'
import FormGridConfigs from './FormGridConfigs.js'

export default class Game extends React.PureComponent{
    constructor(props){
        super(props);
        //console.log("Game constructor");
        this.state = {
            numOfRows: 10,
            numOfCells: 9,
            numOfMines: 8,
            uniqueId : 0 //Reset the game by changing this key. Cause the DOM to throw the old game instance and create new one.
        };
    }

    componentDidUpdate(){
        //console.log("Game componentDidUpdated");
        //this.resetGame();
        // this.setState({
        //     numOfRows: bundle.height,
        //     numOfCells: bundle.width,
        //     numOfMines: bundle.mines,
        // });
    }


    initGame = (_numOfRows, _numOfCells, _numOfMines) =>{
        //console.log("initGame");
        //console.log("_numOfRows: " + _numOfRows);
        //console.log("_numOfCells: " + _numOfCells);
        var a = _numOfRows;
        var b = _numOfCells;
        var c = _numOfMines;
        this.setState ({
            numOfRows: a,
            numOfCells: b,
            numOfMines: c,
        });
        //
        // setTimeout( () => {
        //     this.resetGame();//Letting set state to init params
        // },2000);

    };

    resetGame = () =>{
        console.log("resetGame");
        //this.refs.grid.resetGrid();
        let uniqueId = this.state.uniqueId;
        uniqueId === 0? uniqueId = 1 : uniqueId = 0;
        this.setState({
            uniqueId:uniqueId
        });
    };

    onGameLose = () => {
        this.gameOver("You Lose!!!");
    };

    onGameWin = () => {
        this.gameOver("You Win!!!");
    };

    /*
    * //Fat arrow javaScript function.
    * 1) Solving "this" reference to class from inner function.(Keeping reference to class function from inner function)
    * 2) No need to bind it in constructor. :)
    * */
    gameOver = (msg) => {
        setTimeout( () => {
            alert(msg);
            this.resetGame();
        },100);
    };


    render(){
        return (
            <div >
                <FormGridConfigs
                    ref="inputs"
                    initGame={this.initGame}
                   />
               <br />
                <GridBuilder
                    key={this.state.uniqueId}
                    ref="grid"
                     numOfRows = {this.state.numOfRows}
                     numOfCells = {this.state.numOfCells}
                     numOfMines= {this.state.numOfMines}
                     onGameLose={this.onGameLose}
                     onGameWin={this.onGameWin}
                />
            </div>

        );
    }
}