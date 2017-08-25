import React from 'react';
import GridBuilder from './GridBuilder.js'

export default class Game extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            numOfRows: 10,
            numOfCells: 10,
            numOfMines: 25,
            uniqueId : 0 //Reset the game by changing this key. Cause the DOM to throw the old game instance and create new one.
        };
    }

    setNumOfRows(_numOfRows){
        this.setState({
            numOfRows:_numOfRows
        });
    }

    setNumOfCells(_numOfCells){
        this.setState({
            numOfCells : _numOfCells
        });
    }

    /*
    * //Fat arrow javaScript function.
    * 1) Solving this reference to class from inner function.(Keeping reference to class function from inner function)
    * 2) No need to bind it in constructor. :)
    * */
    resetGame = () =>{
        console.log("resetGame");
        this.refs.grid.resetGrid();
        let uniqueId = this.state.uniqueId;
        uniqueId === 0? uniqueId = 1 : uniqueId = 0;
        this.setState({
            uniqueId:uniqueId
        });
    };

    gameOverCallBack = (_cell) => {
        setTimeout( () => {
            alert("You lose!!!");
            this.resetGame();
        },100);
    };

    onGameWin = () => {
        setTimeout( () => {
            alert("You lose!!!");
            this.resetGame();
        },100);
    };

    render(){
        return (
            <div key={this.state.uniqueId}>

                <button onClick={this.resetGame}>New game</button><br />
                <GridBuilder ref="grid"
                             numOfRows = {this.state.numOfRows}
                             numOfCells = {this.state.numOfCells}
                             numOfMines= {this.state.numOfMines}
                             gameOverCallBack={this.gameOverCallBack}
                             onGameWin={this.onGameWin}
                />
            </div>

        );
    }
}