import React from 'react';

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            hasMine: props.cell.hasMine,
            isFlaged: props.cell.isFlaged,
            isOpen : props.cell.isOpen,
            id_y : props.cell.id_y,
            id_x : props.cell.id_x,
            adjacent : props.cell.adjacent,
        };
    }

    /*
    * Handling changes rendering from parent
    * */
    componentWillReceiveProps = (nextProps) => {//https://stackoverflow.com/questions/41233458/react-child-component-not-updating-after-parent-state-change
        this.setState ( {
            hasMine: nextProps.cell.hasMine,
            isFlaged: nextProps.cell.isFlaged,
            isOpen : nextProps.cell.isOpen,
            gameOver : false,
            id_y : nextProps.cell.id_y,
            id_x : nextProps.cell.id_x,
            adjacent : nextProps.cell.adjacent
        });
    };

    handleClick = (event) => {
        console.log("handleClick");

        if(event.shiftKey && !this.state.isOpen){

            this.props.onCellFlagChange(this.props.cell);

        }else if(!this.state.isFlaged && !this.state.isOpen){

            if(this.state.hasMine){
                this.props.onCellExplode(this.props.cell);

            }else{

                console.log("props.cell.onCellOpend;");
                this.props.onCellOpend(this.props.cell)
            }
        }

    };

    renderSuperman = () => {
        if(this.state.hasMine){
            return (
                <button className="button" onClick= {this.handleClick}>
                    <h10>*</h10>
                    <h10>{this.state.adjacent + ""}</h10><br/>
                    <h10>y: {this.state.id_x + ""}</h10>
                    <h10>x: {this.state.id_y + ""}</h10>
                </button>

            );
        }else{
            return (
                <button className="button" onClick= {this.handleClick}>
                    <h10>{this.state.adjacent + ""}</h10>
                    <h10>y: {this.state.id_x + ""}</h10>
                    <h10>x: {this.state.id_y + ""}</h10>
                </button>

            );
        }

    };

    renderNormal = () => {
        //console.log("Cell.renderNormal");
        var isFlaged = this.state.isFlaged;
        var isOpen = this.state.isOpen;
        var hasMine = this.state.hasMine;
        if(hasMine && isOpen){
            return (
                <button

                    className="button_open"
                    onClick= {this.handleClick}>
                    *
                </button>

            );
        }
        else if(isOpen){
            return (
                <button className="button_open" onClick= {this.handleClick}>
                    {this.state.adjacent + ""}
                </button>

            );
        }else if(isFlaged){
            return (
                <button className="button" onClick= {this.handleClick}>
                    Flag
                </button>
            );
        }else{
            return (
                <button className="button" onClick= {this.handleClick}/>
            );
        }

    };

    renderMineExplode = () => {
        console.log("Cell.renderMineExplode");
        return (
            <button className="button" >*</button>
        );
    };

    render() {
        //console.log("Cell.render");
        //console.log("gameOver: " + this.state.gameOver);

        if(this.state.gameOver){
            //console.log("renderMineExplode");
            return this.renderMineExplode();

        }

        if(false){
            // console.log("renderSuperman");
            return this.renderSuperman();

        }else{
            //  console.log("renderNormal");
            return this.renderNormal();
        }

    }
}