import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';


import SimplePeer from 'simple-peer';

const SocketContext = createContext();

const socket = io('http://localhost:5000');
// const socket = io('https://warm-wildwood-81069.herokuapp.com');


const ContextProvider = ({ children }) => {

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({ isReceivingCall: false, from: '', signal: null });
  const updateCall = (newCall) => {
    setCall(prevCall => ({
      ...prevCall,
      ...newCall
    }));
    console.log(call)
  };

  const [me, setMe] = useState('');

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  // useEffect(() => {
  //   let mounted = true; // To track component unmounting
  
  //   navigator.mediaDevices.getUserMedia({ video: true, audio: true })
  //     .then((currentStream) => {
  //       if (mounted) {
  //         setStream(currentStream);
  //         if (myVideo.current) {
  //           myVideo.current.srcObject = currentStream;
  //         }
  //       }
  //     })
  //     .catch(error => {
  //       console.error('Error accessing camera:', error);
  //     });
  
  //   return () => {
  //     mounted = false; // Clean up on unmount
  //   };
  // }, [myVideo]); // Ensure useEffect runs only when myVideo changes
  
  useEffect(() => {
    const setupMedia = async () => {
      try {
        console.log("Setting up media...");
  
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
  
        if (myVideo.current) {
          console.log("myVideo ref exists, setting srcObject...");
          myVideo.current.srcObject = currentStream;
        } else {
          console.log("myVideo.current is missing in useEffect in context file");
        }
      } catch (err) {
        console.error("Error setting up media:", err);
      }
    };
  
    setupMedia();
   
    socket.on('me', (id) => setMe(id));
  
    socket.on('callUser', ({ from, name: callerName, signal }) => {
      console.log('callUser', { from, name: callerName, signal });
      updateCall({ isReceivingCall: true, from, name: callerName, signal });
    });
  }, []);
  
 

  const answerCall = () => {
    setCallAccepted(true);

    const peer = new SimplePeer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    if(!id) alert("invalid id !!!")
    console.log(call)
    // if (!call || !call.signal) {
    //   console.error("Call state is not initialized");
    //   return;
    // }
    
    const peer = new SimplePeer({ initiator: true, trickle: false, stream });
    peer.on('signal', (data) => {
      socket.emit('callUser', { userToCall: id, signalData: data, from: me, name });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      updateCall({ isReceivingCall: false, from: id, signal });
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
      
    </SocketContext.Provider>
  );

};

export { ContextProvider, SocketContext };
