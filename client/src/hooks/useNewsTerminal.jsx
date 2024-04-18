import { useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import config from '../config';

const useNewsTerminal = () => {
  const [messages, setMessages] = useState([]);

  const { sendMessage, lastMessage } = useWebSocket(config.wsUri, {
    shouldReconnect: (closeEvent) => true,
    reconnectAttempts: 100,
    reconnectInterval: 3000,
  });

  useEffect(() => {
    const heartbeat = setInterval(() => {
      sendMessage('ping');
    }, 10 * 1000);

    return () => clearInterval(heartbeat);
  }, [sendMessage]);

  useEffect(() => {
    const res = sendMessage('login 842752f3f9b8271110aa50829407762f536b8a34e43661db7f3e3ff4cb8ca772');
  }, []);

  useEffect(() => {
    if (lastMessage) {
      try {
        let parsedMessage = JSON.parse(lastMessage?.data);

        if (parsedMessage.body) {
          parsedMessage = {
            ...parsedMessage,
            source: parsedMessage.title,
            title: parsedMessage.body,
            body: undefined,
          };
        }
        setMessages(prevMessages => {
          const newMessages = [parsedMessage, ...prevMessages];
          return newMessages;
        });
      } catch (e) {
        if (lastMessage?.data === 'pong') {
          //console.log('Pong received');
        } else {
          console.error('Received non-JSON message:', lastMessage?.data);
        }
      }
    }
  }, [lastMessage]);

  return { messages };
};

export default useNewsTerminal;





