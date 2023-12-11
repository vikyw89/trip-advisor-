import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TranslateIcon from '@mui/icons-material/Translate';
import MicIcon from '@mui/icons-material/Mic';
import Dialogue from 'src/components/Dialogue';
import ChatInput from 'src/components/ChatInput';
import { useNavigate } from 'react-router-dom';

const Translate = () => {
  const inputRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [selectedTab, setSelectedTab] = useState('translate');
  const [messages, setMessages] = useState([]);
  const [voiceNotes, setVoiceNotes] = useState([]);
  const [translatedText, setTranslatedText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const navigate = useNavigate();

  // Removed unused state variables
  // Removed audioChunks, isPlaying, and audioDuration

  useEffect(() => {
    if (translatedText) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { type: 'bot', text: translatedText },
      ]);
    }
  }, [translatedText]);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
    switch (newValue) {
      case 'itinerary':
        navigate('/itinerary');
        break;
      case 'translate':
        // Handle navigation or other logic for the Translate tab
        break;
      default:
        break;
    }
  };

  const sendAudioData = async (audioBlob) => {
    try {
        const arrayBuffer = await audioBlob.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
    //   const formData = new FormData();
    //   formData.append('audio', audioBlob);
        // console.log(audioBlob)
      // Your backend URL
      const backendUrl = 'http://localhost:8000/users/speech-to-text';

      // Fetch options
      const options = {
        method: 'POST',
        body: byteArray,
      };

      // Send the audio data to the backend
      const response = await fetch(backendUrl, options);

      if (response.ok) {
        const data = await response.json();
        const transcript = data.transcript;

        // Update state or perform any other actions with the transcript
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: 'bot', text: transcript },
        ]);
      } else {
        console.error('Failed to send audio data');
      }
    } catch (error) {
      console.error('Error sending audio data:', error);
    }
  };
  const handleOnSendMsg = async (msg) => {
    setSending(true);

    setMessages((prevMessages) => [
      ...prevMessages,
      { type: 'sender', text: msg },
    
    ]);

    setTimeout(() => {
      setSending(false);
    }, 2000);
  };

  const handleMicClick = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);

      let chunks = [];
      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
        setVoiceNotes((prevVoiceNotes) => [
          ...prevVoiceNotes,
          audioBlob, // Store the Blob directly
        ]);
        chunks = []; // Clear the chunks array for the next recording
      };

      recorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };


  const stopRecording = () => {
    setIsRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const handleSendVoiceNote = async () => {
    const lastVoiceNote = voiceNotes[voiceNotes.length - 1];
    sendAudioData(lastVoiceNote);
  
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        type: 'sender',
        voiceNoteBlob: lastVoiceNote,
      },
    ]);
  
    // Set sending to true initially, and then immediately set it to false
    setSending(true);
  
    // Set a timeout to hide the "Send" button after 2 seconds
    setTimeout(() => {
    }, 400);
  };
  

  return (
    <Stack direction="column" sx={{ overflowY: 'hidden', height: '94%'  ,         background: "#001f4f" // Light blue color
}}>
  
  <Box sx={{
        width: 'inherit%', height: 'inherit', overflowY: "scroll", scrollbarWidth: 'thin',
        '&::-webkit-scrollbar': {
          width: '0',
        },
        '&::-webkit-scrollbar-track': {
          background: "#f1f2f1",
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: '#888',
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#555'
        }
      }}>
      {messages.map((message, index) => (
  <Stack
    key={index}
    direction="row"
    justifyContent={message.type === 'sender' ? 'flex-end' : 'flex-start'}
  >
    <Dialogue type={message.type}>
  <div style={{ textAlign: message.type === 'sender' ? 'right' : 'left' }}>
    {message.text}
  </div>
  {message.voiceNoteBlob && (
    <audio controls>
      <source src={URL.createObjectURL(message.voiceNoteBlob)} type="audio/mp3" />
      Your browser does not support the audio element.
    </audio>
  )}
</Dialogue>


          </Stack>
        ))}
     
      <Stack
        width="100%"
        direction="row"
        position="absolute"
        left="0"
        bottom="7%"
        
      >
        <ChatInput
          sending={sending}
          inputRef={inputRef}
          onSendMessage={handleOnSendMsg}

          ariaLabel="Type or record audio for translation..."

        />
        <Button
          onClick={handleMicClick}
          variant="contained"
          size="small"
          color={isRecording ? 'secondary' : 'primary'}
          sx={{ mr: 5, mt: 2, p: 0.5, minWidth: 'unset', width: '2rem', height: '2rem'  }}
        >
          <MicIcon sx={{ fontSize: 24 }} />
        </Button>
        {!isRecording && voiceNotes.length > 0 && !sending && (
       <Button
       onClick={handleSendVoiceNote}
       variant="outlined"
       size="small"
       sx={{
         mr: 10,
         mt: 2,
         p: 0.1,
         minWidth: 'unset',
         width: '5rem',
         height: '2rem',
         borderRadius : "5%",
         backgroundColor: '#fe28', // Green color for the background
         color: '#fff', // White color for the text
         '&:hover': {
           backgroundColor: '#4C2F50', // Darker green color on hover
         },
       }}
     >
       Send
     </Button>
     
        )}
      </Stack>
      

      <Stack
        width="100%"
        direction="row"
        position="absolute"
        left="0"
        bottom="0"
      >
        <BottomNavigation
          value={selectedTab}
          onChange={(event, newValue) => handleTabChange(newValue)}
          showLabels
          sx={{
            width: '100%',
            position: 'absolute',
            bottom: 0,
            backgroundColor: '#Ffffff', // Adjust the background color as needed
        }}
        >
          <BottomNavigationAction
            label="Home"
            value="itinerary"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="Translate"
            value="translate"
            icon={<TranslateIcon />}
          />
        </BottomNavigation>
        
      </Stack>
      </Box>
    </Stack>
  );
};

export default Translate;