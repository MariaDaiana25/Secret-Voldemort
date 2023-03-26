import React, {useState, useRef}  from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from 'react-modal';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import CheckButton from "react-validation/build/button";
import { join_match } from "../actions/join_match";
import { list_match } from "../actions/list_match";
import useInterval from "./UseInterval";
import "./css/ShowMatch.css"

Modal.setAppElement('#root');

const required = (value) => {
    if (!value) {
      return (
        <div className="alert alert-danger" role="alert">
          This field is required!
        </div>
      );
    }
};

const ShowMatch = (props) => {
    const { matchs: currentMatchs } = useSelector((state) => state.list_match);
    const { user: currentUser } = useSelector((state) => state.auth);
    
    const form = useRef();
    const checkBtn = useRef();
    
    const [nickname, SetNickname] = useState("");
    const [name_match, SetName_match] = useState("");
    const [stop, setStop] = useState(false);

    const [joinMatchLoading, setjoinMatchLoading] = useState(false);
    const { message } = useSelector(state => state.message);
    
    const dispatch = useDispatch();
  
    useInterval(() => {
        dispatch(list_match())
        .catch(() => {
            setStop(true);
        });
    }, (stop) ? null : 1000);

    const customStyles = {
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
            width:400,
            height:320,
            top: 150,
            left: 550,
            backgroundColor:'#010014',
          }
    };

    const [modalIsOpen,setIsOpen] = useState(false);
    const openModal = () => {
      setIsOpen(true);
    }

    const handleModal = (e, name_match, state_match) =>  {
        e.preventDefault();
        if("waiting" === state_match) {
            openModal(true);
            SetName_match(name_match);
        }
    };

    const onChangeNickName = (e) => {
        const nickname = e.target.value;
        SetNickname(nickname);
    };

    const handleJoinMatch = (e) => {
        e.preventDefault();
        setjoinMatchLoading(true);
        setIsOpen(false);
      
        form.current.validateAll();
      
        
        if (checkBtn.current.context._errors.length === 0) {
            dispatch(join_match(name_match, nickname, currentUser.user_name))
                .then(() => {
                props.history.push(`/game/${name_match}`);
                })
                .catch(() => {
                setjoinMatchLoading(false);
                });
        } else {
                setjoinMatchLoading(false);
        }
    }; 

    return (
        <div className="content-all-showmatch">
            <div className="content-showmatch">
                <ul>{ (Array.isArray(currentMatchs) && currentMatchs.length) ?
                        currentMatchs.map((match, index) => {
                        return (
                            ("finilazed" === match.state_match) ?
                            null
                            :
                            <h4 key={index}>
                                <Modal
                                isOpen={modalIsOpen}
                                style={customStyles}
                                contentLabel="Join Match Modal"
                                >
                                <Form onSubmit={handleJoinMatch} ref={form}>
                                   <div className="content-joinMatch">
                                        <div className="form-group">
                                        <label className="text-showmatch">Nickname</label>
                                            <Input
                                                type="text"
                                                className="form-control"
                                                value={nickname}
                                                onChange={onChangeNickName}
                                                validations={[required]}
                                            />
                                        </div>

                                        <div className="form-group">
                                        <button className="button-join" disabled={joinMatchLoading}>
                                        {joinMatchLoading && (
                                            <span className="spinner-border spinner-border-sm"></span>
                                        )} Join </button>
                                        </div>
                                        {message && (
                                            <div className="form-group">
                                                <div className="alert alert-danger" role="alert">
                                                    {message}
                                                </div>
                                            </div>
                                        )}
                                        <CheckButton style={{ display: "none" }} ref={checkBtn} />
                                    </div>
                                </Form>
                                </Modal>
                                <h4 className="name-match">{match.name_match}</h4>
                                <h4 className="text-number-players">Estate Match: <text className="number-players">{match.state_match}</text></h4>
                                <p 
                                    className="text-number-players"> 
                                        Number players: <text
                                            className="number-players">
                                            {match.number_player} 
                                        </text> 
                                </p>
                                <button 
                                    className="boton-match" 
                                    onClick={(e) => { handleModal(e, match.name_match, match.state_match) }}>
                                    {match.name_match}
                                </button>
                            </h4>
                        );
                    })
                    :
                    <div className="content-title-showmatch">
                        <h5 className="loading-games">
                            Loading games
                            <span className="spinner-showmatch spinner-border spinner-border-bg"></span>
                        </h5>
                    </div>
                    }
                </ul>
            </div>
        </div>
    );
};

export default ShowMatch;
