import React, { useState, useEffect } from 'react';
import "./css/Board.css";

import proclamacionOrdFenix from "../img/board_and_cards/ProclamacionOrdFenix.png";
import proclamacionMortifago from "../img/board_and_cards/ProclamacionMortifago.png";

const Board = (props) => {
    const [ mortifago_1, setMortifago_1 ] = useState(false);
    const [ mortifago_2, setMortifago_2 ] = useState(false);
    const [ mortifago_3, setMortifago_3 ] = useState(false);
    const [ mortifago_4, setMortifago_4 ] = useState(false);
    const [ mortifago_5, setMortifago_5 ] = useState(false);
    const [ mortifago_6, setMortifago_6 ] = useState(false);
    const [ ord_fenix_1, setOrd_fenix_1 ] = useState(false);
    const [ ord_fenix_2, setOrd_fenix_2 ] = useState(false);
    const [ ord_fenix_3, setOrd_fenix_3 ] = useState(false);
    const [ ord_fenix_4, setOrd_fenix_4 ] = useState(false);
    const [ ord_fenix_5, setOrd_fenix_5 ] = useState(false);
    

    const  handleToproclamationOF = (id) => {

        switch (id) {
            case 1:
                setOrd_fenix_1(true);
                break;
            case 2:
                setOrd_fenix_2(true);
                break;
            case 3:
                setOrd_fenix_3(true);
                break;
            case 4:
                setOrd_fenix_4(true);
                break;
            case 5:
                setOrd_fenix_5(true);
                break;
            default:
                return null;
        }
    };

    const handleToproclamationM = (id) => {
        switch(id) {
            case 11:
                setMortifago_1(true);
                break;
            case 10:
                setMortifago_2(true);
                break;
            case 9:
                setMortifago_3(true);
                break;
            case 8:
                setMortifago_4(true);
                break;
            case 7:
                setMortifago_5(true);
                break;
            case 6:
                setMortifago_6(true);
                break;
            default:
                return null;
        }
    };
    
    useEffect(() => {
        console.log("pro: ", props.procOrdFenix);

        handleToproclamationOF(props.procOrdFenix);
    }, [props.procOrdFenix])

    useEffect(() => {
        console.log("proclamaciones", props.procMortifago);
        
        handleToproclamationM(12 - props.procMortifago);
    }, [props.procMortifago])


    return( 
        <div className="borde-board">
            <div className="board_Ord_Fenix">
                <div className="marcador_1"/>
                <div className="marcador_2"/>
                <div className="marcador_3"/>
                <div className="marcador_4"/>

                <img id={1} className={ ord_fenix_1 ? "procOrdFenix-ON" : "procOrdFenix-OFF"} src={proclamacionOrdFenix} alt="card"/>    
                <img id={2} className={ ord_fenix_2 ? "procOrdFenix1-ON" : "procOrdFenix1-OFF"} src={proclamacionOrdFenix} alt="carta no carga"/>    
                <img id={3} className={ ord_fenix_3 ? "procOrdFenix2-ON" : "procOrdFenix2-OFF"} src={proclamacionOrdFenix} alt="carta no carga"/>    
                <img id={4} className={ ord_fenix_4 ? "procOrdFenix3-ON" : "procOrdFenix3-OFF"} src={proclamacionOrdFenix} alt="carta no carga"/>    
                <img id={5} className={ ord_fenix_5 ? "procOrdFenix4-ON" : "procOrdFenix4-OFF"} src={proclamacionOrdFenix} alt="carta no carga"/>    
            </div>
            <div className="board_Mortifago_1">
                <img id={11} className={ mortifago_1 ? "procMortifago-ON" : "procMortifago-OFF"} src={proclamacionMortifago} alt="carta no carga"/>    
                <img id={10} className={ mortifago_2 ? "procMortifago1-ON" : "procMortifago1-OFF"} src={proclamacionMortifago} alt="carta no carga"/>    
                <img id={9} className={ mortifago_3 ? "procMortifago2-ON" : "procMortifago2-OFF"} src={proclamacionMortifago} alt="carta no carga"/>    
                <img id={8} className={ mortifago_4 ? "procMortifago3-ON" : "procMortifago3-OFF"} src={proclamacionMortifago} alt="carta no carga"/>    
                <img id={7} className={ mortifago_5 ? "procMortifago4-ON" : "procMortifago4-OFF"} src={proclamacionMortifago} alt="carta no carga"/>    
                <img id={6} className={ mortifago_6 ? "procMortifago5-ON" : "procMortifago5-OFF"} src={proclamacionMortifago} alt="carta no carga"/>
            </div>
        </div>
    )
};

export default Board;