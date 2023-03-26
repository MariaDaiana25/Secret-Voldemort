import React, { useState } from 'react';
import { useDispatch ,useSelector } from "react-redux";
import { govermment_role } from "../actions/govermment_role";
import ReadytoContinue from "../services/votes.services";
import ShowResultVotes from "../services/votes.services";
import Modal from 'react-modal';
import {
    DIRECTOR_SET
} from "../actions/types";

import Swal from 'sweetalert2';

import "./css/Vote.css";

const ShowVotes = (props) => {

    const { isMatchIn } = useSelector((state) => state.match);
    const { isJoinMatchIn } = useSelector((state) => state.join_match);
    const { player: currentPlayerOne } = useSelector((state) => state.match);
    const { player: currentPlayer } = useSelector((state) => state.join_match);
    
    const [ handleOpen, sethandleOpen ] = useState(true);
    const [ readytoContinue, setreadytoContinue ] = useState(false);
    const [ isOpenModal, setisOpenModal ] = useState(false);
    const [ resultsVotes, setresultsVotes ] = useState({
        number_votes: 0,
        winner_vote: "",
        results_votes: []
      });

    const dispatch = useDispatch();

    const handleOpenModal = () => {
        if(isMatchIn) {
            ShowResultVotes.view_results(currentPlayerOne.name_match).then(
                (data) => {
                    if(0 === data.codigo) {
                        setresultsVotes({
                            number_votes: data.votos,
                            winner_vote: data.votacion_ganadora,
                            results_votes: data.detalle_votos
                        });
                        console.log(data.votacion_ganadora);
                        if("Lumus" === data.votacion_ganadora) {
                            if(Array.isArray(props.Players) && props.Players.length) {
                                let player = props.Players.filter((player) =>
                                "Director" === player.govermment_role);
                                let nickname = player[0].nickname;
                                console.log("Director: ", nickname);
                                dispatch(govermment_role(DIRECTOR_SET, "Director", nickname));
                            };
                        };
                        setisOpenModal(true);
                        sethandleOpen(false);
                    };
                }, (error) => {
                    Swal.fire({title:error.toString(), background:"#000000f5"});
                }
            );
        };
        if(isJoinMatchIn) {
            ShowResultVotes.view_results(currentPlayer.name_match).then(
                (data) => {
                    if(0 === data.codigo) {
                        setresultsVotes({
                            number_votes: data.votos,
                            winner_vote: data.votacion_ganadora,
                            results_votes: data.detalle_votos
                        });
                        console.log(data.votacion_ganadora);
                        if("Lumus" === data.votacion_ganadora) {
                            if(Array.isArray(props.Players) && props.Players.length) {
                                let player = props.Players.filter((player) =>
                                "Director" === player.govermment_role);
                                let nickname = player[0].nickname;
                                console.log("Director: ", nickname);
                                dispatch(govermment_role(DIRECTOR_SET, "Director", nickname));
                            };
                        };
                        setisOpenModal(true);
                        sethandleOpen(false);
                    };
                }, (error) => {
                    Swal.fire({title:error.toString(), background:"#000000f5"});
                }
            );
        };
    };

    const changeState = () => {
        if(isMatchIn) {
            ReadytoContinue.change_status_game(currentPlayerOne.name_match, resultsVotes.winner_vote);
            setreadytoContinue(true);
        }
        if(isJoinMatchIn) {
            ReadytoContinue.change_status_game(currentPlayer.name_match, resultsVotes.winner_vote);
            setreadytoContinue(true);
        }
    };

    return (
        <div>
            {(handleOpen) ?
            (handleOpenModal())
            :
            (readytoContinue) ?
            <h1 className="vote-wait" >Watching votes results</h1>
            :
            <div>
                <button className="vote-validate" onClick={() => {changeState()}}>
                    Ready to continue
                </button>
            </div>
            }
            <Modal
            isOpen={isOpenModal}
            shouldCloseOnOverlayClick={false}
            onRequestClose={()=>setisOpenModal(false)}
            id = "modal-results-votes"
            style={
                {
                overlay:{
                  backgroundColor:"#00000085",
                  position:"absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                },
                content:{
                  padding:35, 
                  width:480,
                  height:450,
                  top: 100,
                  left: 480,
                  backgroundColor:'#010014',
                }
                }
            }>
            <div>    
                <h5 className="text-show">Total Number votes<p className="vote-win">{resultsVotes.number_votes}</p></h5>
                <h3 className="text-show">Winner Vote<p className="vote-win">{resultsVotes.winner_vote}</p></h3>
            </div>
            {
                resultsVotes.results_votes.map((result, index) => {
                    return (
                        <p className="list-candidates" key={index}>
                            {result.nickname} <b>voto:</b> {result.suffrage}
                        </p>
                    )
                })
            }
            <div>
                <button className="close-modal-showmatch" onClick={() => setisOpenModal(false)}> Close </button>
            </div>
            </Modal>
            
        </div>
    );
}

export default ShowVotes;