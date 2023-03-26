import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from "react-redux";
import { suffrage, validar_gobierno } from "../actions/vote";
import Modal from 'react-modal';

import "./css/Vote.css";
import lumus from "../img/board_and_cards/LUMUS.png";
import nox from "../img/board_and_cards/NOX.png";

const Vote = (props) => {
  
  const { isMatchIn } = useSelector((state) => state.match);
  const { isJoinMatchIn } = useSelector((state) => state.join_match);
  const { player: currentPlayerOne } = useSelector((state) => state.match);
  const { player: currentPlayer } = useSelector((state) => state.join_match);

  const [ isOpenModal, setisOpenModal ] = useState(false);
  const [ candidateMM, setCandidateMM ] = useState("");
  const [ candiddateD, setCandidateD ] = useState("");
  const [ readyVote, setreadyVote ] = useState(false);

  const dispatch = useDispatch();

  const handleModal = () => {
    if(isMatchIn){
        dispatch(validar_gobierno(currentPlayerOne.name_match))
        .catch((data_error) => {
          Swal.fire({title:data_error,icon:'error',background:'#000000f5'});
        });

        if(Array.isArray(props.Players) && props.Players.length) {

          let candidateMagicMinister = props.Players.filter((player) =>
          player.govermment_role === "candidateMagicMinister");
      
          let candidateDirector = props.Players.filter((player) =>
          player.govermment_role === "candidateDirector");
                
          let candidateMM = candidateMagicMinister[0].nickname;
          let candidateD = candidateDirector[0].nickname;
      
          setCandidateMM(candidateMM);
          setCandidateD(candidateD);

          setisOpenModal(true);
        } else {
          Swal.fire({title:"No se encontro candidateD o CandidateMM",background:'#000000f5'});
        }
    }
    if(isJoinMatchIn){
        dispatch(validar_gobierno(currentPlayer.name_match))
        .catch((data_error) => {
          Swal.fire({title:data_error,icon:'error',background:'#000000f5'});
        });

        if(Array.isArray(props.Players) && props.Players.length) {

          let candidateMagicMinister = props.Players.filter((player) =>
          player.govermment_role === "candidateMagicMinister");
      
          let candidateDirector = props.Players.filter((player) =>
          player.govermment_role === "candidateDirector");
                
          let candidateMM = candidateMagicMinister[0].nickname;
          let candidateD = candidateDirector[0].nickname;
      
          setCandidateMM(candidateMM);
          setCandidateD(candidateD);

          setisOpenModal(true);
        } else {
          Swal.fire({title:"No se encontro candidateD o CandidateMM",background:'#000000f5'});
        }
    }
  };
  
  
  const handleVotes = (e) => {
    e.preventDefault();
    
    const votes = e.target.value;

    let v = 0;
    if("lumus" === votes) {
      v = 1;
    }

    if(isMatchIn){
        dispatch(suffrage(currentPlayerOne.name_match, currentPlayerOne.position_player, v))
        .then(() => {
          Swal.fire({icon:'success', background:'#000000f5'});
          setisOpenModal(false);
          setreadyVote(true);
        })
        .catch((data_error) => {
          Swal.fire({title:data_error,icon:'error',background:'#000000f5'});
        });
      }

      if(isJoinMatchIn){
        dispatch(suffrage(currentPlayer.name_match, currentPlayer.position_player, v))
        .then(() => {
          Swal.fire({icon:'success', background:'#000000f5'});
          setisOpenModal(false);
          setreadyVote(true);
        })
        .catch((data_error) => {
          Swal.fire({title:data_error,icon:'error',background:'#000000f5'});
        });
    }
    
  };

    return (
        <div>
          {
            readyVote ?
            <h1 className="vote-wait">Waiting to vote all of palyers</h1>
            :
            <button className="vote-validate" onClick={() => {handleModal()}}>SUFFRAGE</button>
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
            <p className="list-candidates">Candidato a Ministro de Magia: {candidateMM}</p>
            <p className="list-candidates">Candidato a Director: {candiddateD}</p>
            <div>

              <div className="radio-buttons font">
                
                <input className="card-lumus input-img-vote" src={lumus} alt="LUMUS"
                    id="lumus"
                    value="lumus"
                    name="votes"
                    type="image"
                    onClick={handleVotes}
                />

                <input className="card-nox input-img-vote" src={nox} alt="NOX"
                    id="nox"
                    value="nox"
                    name="votes"
                    type="image"
                    onClick={handleVotes}
                    />

              </div>
            </div>
          </Modal>
        </div>
    );
};

export default Vote;