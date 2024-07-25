import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { allUsersRoute,host } from "../utils/APIRoutes";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";
import ChatContainer from "../components/ChatContainer";
import {io} from 'socket.io-client'


export default function Chat() {
  const socket = useRef();
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(undefined);
  const [currentChat, setcurrentChat] = useState(undefined)
  const [IsLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      } else {
        const user = await JSON.parse(localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY));
        setCurrentUser(user);
        setIsLoaded(true)
      }
    };
    fetchCurrentUser();
  }, [navigate]);

  useEffect(()=> {
     if(currentUser){
      socket.current = io(host);  //function to get individual socket
      socket.current.emit("add-user", currentUser._id); //to send the events we use the emit  when we connect this evemts are send
     }
  })
  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser) {
        if (currentUser.isAvatarImageSet) {
             const data = await axios.get(`${allUsersRoute}/${currentUser._id}`);

              setContacts(data.data);
           
         
        }else {
          navigate("/setAvatar");
        }
      }
    };
    fetchContacts();
  }, [currentUser, navigate]);

  const handleChangeChat = (chat) => {
 
    setcurrentChat(chat)
  };


  console.log("Contacts:", contacts);

  return (
    <Container>
      <div className="container">
        <Contacts contacts={contacts}
          currentUser={currentUser}
         changeChat={handleChangeChat}
         />
         {
          IsLoaded  && currentChat === undefined ? (
          <Welcome   currentChat={currentChat}/>
          ): (
            <ChatContainer
             currentChat={currentChat}
             currentUser = {currentUser}
             socket = {socket}
             />
          )
         }
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1rem;
  align-items: center;
  background-color: #131324;

  .container {
    height: 85vh;
    width: 85vw;
    background-color: #00000076;
    display: grid;
    grid-template-columns: 25% 75%;
    @media screen and (min-width: 720px) and (max-width: 1080px) {
      grid-template-columns: 35% 65%;
    }
  }
`;
