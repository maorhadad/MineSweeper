import React from 'react';
import GridBuilder from './GridBuilder.js'
import FormGridConfigs from './FormGridConfigs.js'

export default class Game extends React.Component{
    constructor(props){
        super(props);
        //console.log("Game constructor");
        this.state = {
            superman:false,
            numOfRows: 10,
            numOfCells: 9,
            numOfMines: 8,
            uniqueId : 0 //Reset the game by changing this key. Cause the DOM to throw the old game instance and create new one.
        };
    }

    initGame = (_numOfRows, _numOfCells, _numOfMines) =>{
        console.log("initGame");
        var a = _numOfRows;
        var b = _numOfCells;
        var c = _numOfMines;
        this.setState ({
            numOfRows: a,
            numOfCells: b,
            numOfMines: c,

        },this.resetGame());
    };

    notifySuperManStateChange = (isSuperMan) =>{
        console.log("notifySuperManStateChange");
        this.setState({
            superman:isSuperMan
        })
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
                    notifySuperManStateChange={this.notifySuperManStateChange}
                   />
               <br />
                <GridBuilder
                    key={this.state.uniqueId}
                    ref="grid"
                    superman={this.state.superman || false}
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