import React from 'react';

export default class Cell extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            superman : true,
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
       // console.log("componentWillReceiveProps");
        var hasMine= nextProps.cell.hasMine;
        var isFlaged= nextProps.cell.isFlaged;
        var isOpen = nextProps.cell.isOpen;
        var adjacent = nextProps.cell.adjacent;
        var id_y = nextProps.cell.id_y;
        var id_x = nextProps.cell.id_x;


        if(hasMine === this.state.hasMine
            && isFlaged === this.state.isFlaged
            && isOpen === this.state.isOpen
            && id_y === this.state.id_y
            && id_x === this.state.id_x
            && adjacent === this.state.adjacent
            && isFlaged === this.state.isFlaged){
            return;
        }
        console.log("componentWillReceiveProps true");
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
        //console.log("handleClick");

        if(event.shiftKey && !this.state.isOpen){

            this.props.onCellFlagChange(this.props.cell);

        }else if(!this.state.isFlaged && !this.state.isOpen){

            if(this.state.hasMine){
                this.props.onCellExplode(this.props.cell);

            }else{

                //console.log("props.cell.onCellOpend;");
                this.props.onCellOpend(this.props.cell)
            }
        }

    };

    renderSuperman = () => {
        if(this.state.hasMine){
            return (
                <td className="button" onClick= {this.handleClick}>
                    <h10>*</h10>
                    <h10>{this.state.adjacent + ""}</h10><br/>


                </td>

            );
        }else{
            return (
                <td className="button" onClick= {this.handleClick}>
                    <h10>{this.state.adjacent + ""}</h10>
                </td>

            );
        }

    };

    setOpen = (_isOpen)=>{
        if(_isOpen === this.state.isOpen){
            return
        }
        this.setState({
            isOpen:_isOpen
        });
    };

    renderNormal = () => {
        //console.log("Cell.renderNormal");
        var isFlaged = this.state.isFlaged;
        var isOpen = this.state.isOpen;
        var hasMine = this.state.hasMine;
        var superman = this.state.superman;
        if(hasMine && isOpen){
            return (
                <td
                    className="button_open"
                    onClick= {this.handleClick}>
                    *
                </td>
            );
        }
        else if(isOpen){
            return (
                <td className="button_open" onClick= {this.handleClick}>
                    {this.state.adjacent + ""}
                </td>

            );
        }else if(isFlaged){
            return (
                <td className="button" onClick= {this.handleClick}>
                    Flag
                </td>
            );
        }else if(superman && hasMine) {
            return (
                <td className="button" onClick={this.handleClick}>
                    *
                </td>
            );
        } else{
            return (
                <td className="button" onClick= {this.handleClick}/>
            )
        }

    };

    renderMineExplode = () => {
      //  console.log("Cell.renderMineExplode");
        return (
            <td className="button" >*</td>
        );
    };

    render() {
        console.log("Cell.render");
        //console.log("gameOver: " + this.state.gameOver);

        if(this.state.gameOver){
            //console.log("renderMineExplode");
            return this.renderMineExplode();

        }

        // if(this.state.superman){
        //     // console.log("renderSuperman");
        //     return this.renderSuperman();
        //
        // }else{
            //  console.log("renderNormal");
            return this.renderNormal();
       // }

    }
}