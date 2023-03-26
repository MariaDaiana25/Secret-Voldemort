import React, { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { define_role } from "../actions/define_role";
import Modal from 'react-modal';

import Swal from 'sweetalert2';
import "./css/DefineDirector.css";

const DefineDirector = (props) => {
    
  const { isMatchIn } = useSelector((state) => state.match);
  const { isJoinMatchIn } = useSelector((state) => state.join_match);

  const { player: currentMatchPlayerOne } = useSelector((state) => state.match);
  const { player: currentMatchPlayer } = useSelector((state) => state.join_match);
  const { nickname_D } = useSelector((state) => state.govermment_role);

  const [election, setElection] = useState("");
  const [OK, setOK] = useState(true);
  const [isOpenModal, setisOpenModal] = useState(false);

  const dispatch = useDispatch();

  const onChangeVotes = (e) => {
    const election = e.target.value;
    setElection(election);
    setOK(false);
  };
  
  const handleVotes = (e) => {
    e.preventDefault();

    let player = props.Players.filter((player) => player.nickname === election);
    let position_player = player[0].position_player;

    if(isMatchIn){
        dispatch(define_role(currentMatchPlayerOne.name_match, position_player, 4))
        .then(() => {
            Swal.fire({title:"Se definio el nuevo candidateDirector", background:"#000000f5"});
            setisOpenModal(false);
        })
        .catch((data_error) => {
            Swal.fire({title:data_error, background:"#000000f5"});
        });
    }

    if(isJoinMatchIn){
        dispatch(define_role(currentMatchPlayer.name_match, position_player, 4))
        .then(() => {
            Swal.fire({title:"Se definio el nuevo candidateDirector", background:"#000000f5"});
            setisOpenModal(false);
        })
        .catch((data_error) => {
            Swal.fire({title:data_error, background:"#000000f5"});
            setisOpenModal(false);
        });
    }
    setisOpenModal(false);
  };

  const HandleIsCandidateMagicMinister = () => {
        if(Array.isArray(props.Players) && props.Players.length) {
          let player = props.Players.filter((player) =>
                          "candidateMagicMinister" === player.govermment_role);
            if(player[0] === undefined) {
                return false;
            } else {
                return(props.namePlayer === player[0].nickname);
            }
        } else {
            return false;
        };
  };

    return (
        <div>
            {
            (HandleIsCandidateMagicMinister()) ?
            <button className="boton-Director" onClick={() => setisOpenModal(true)}>
                Choose Director</button>
            :
            <h4 className="select-candidate-wait">Selecting Director Candidate</h4>
            }
            <Modal
            isOpen={isOpenModal}
            shouldCloseOnOverlayClick={false}
            onRequestClose={()=>setisOpenModal(false)}
            id = "modal-candidates"
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
                { (Array.isArray(props.Players) && props.Players.length) ? 
                props.Players.map((player, index) => {
                    if("candidateMagicMinister" !== player.govermment_role
                    && "MagicMinister" !== player.govermment_role
                    && "Director" !== player.govermment_role
                    && nickname_D !== player.nickname
                    ) {
                        return (
                            <p key={index} className="radio-buttons candidates-players">
                                {player.nickname}
                                <input
                                    id={index}
                                    value={player.nickname}
                                    name="election"
                                    type="radio"
                                    onChange={onChangeVotes}
                                />
                            </p>
                        )
                    } else {
                        return(
                            null
                        )
                    }
                })
                : 
                <h4 className="select-candidate-wait">
                    No candidates available
                </h4>
                }
                <div>
                <button onClick={handleVotes} className="btn btn-primary btn-block button-vote" disabled={OK}>
                    Enter
                </button>
                </div>
            </div>
            </Modal>

        </div>
    );
};

export default DefineDirector;