//Converts the buffere object (assumed to be a Buffer) to a Base64-encoded string. Base64 encoding is commonly used to represent binary data in an ASCII string format.
 //  data.push(...): Adds the Base64-encoded string to the data array.
 
import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import {Buffer} from 'buffer'

const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4567894`;

    const  navigate = useNavigate();

    const[avatars, setAvatars] = useState([]);
    const[isLoading, setIsLoading] = useState(true);
    const[selectedAvatar, setSelectedAvatar] = useState(undefined);

    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      };

     useEffect( () => {
      if (!localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)) {
        navigate("/login");
      }
    }, []);

  const setProfilePicture = async () => {

    if (selectedAvatar === undefined) {
      toast.error("Please select an avatar", toastOptions);
    } 
    else {
      console.log("I am");
      const user = await JSON.parse(
        localStorage.getItem(process.env.REACT_APP_LOCALHOST_KEY)
      );
      
      console.log("user " + user);
      const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
        image: avatars[selectedAvatar],
      });
      
      
      if (data) {
        user.isAvatarImageSet = true;
        user.avatarImage = data.image;
        localStorage.setItem(
          process.env.REACT_APP_LOCALHOST_KEY,
          JSON.stringify(user)
        );
        navigate("/");
      } else {
        toast.error("Error setting avatar. Please try again.", toastOptions);
      }
   
    }
  };
      
   useEffect( () => {
    const fetchData = async () => {
      const data = [];
      for (let i = 1; i < 4; i++) {
      try{
        const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = Buffer.from(image.data); 
        data.push(buffer.toString("base64"));
         }catch (error) {
           console.error("Error fetching avatars:", error);
           toast.error("Error fetching avatars. Please try again.", toastOptions);
        }
      }
           setAvatars(data);
           setIsLoading(false);
      };
   
            fetchData();
      }, []);


  
  return (
    <>
        {isLoading ? (
            <Container>
                <img src={Loader} alt="loader" className="loader" />
            </Container>
        ) : (
            <Container>
                <div className="title-container">
                    <h1>Pick your profile picture</h1>
                </div>
                <div className="avatars">
                    {avatars.map((avatar, index) => {
                        return (
                            <div
                                key={index}
                                className={`avatar ${selectedAvatar === index ? "selected" : ""}`}
                                onClick={() => setSelectedAvatar(index)}
                            >
                                <img
                                    src={`data:image/svg+xml;base64,${avatar}`}
                                    alt="avatar"
                                    className="src"
                                    key={avatar}
                                    onClick={() => setSelectedAvatar(index)}
                                />
                            </div>
                        );
                    })}
                </div>
                <button type="button" className="submit-btn" onClick={setProfilePicture}>
                    Set as Profile Picture
                </button>
            </Container>
        )}
        <ToastContainer />
    </>
);
}


const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title-container {
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #997af0;
    }
  }
`;

export default SetAvatar
