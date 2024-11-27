import { useEffect, useRef, useState } from "react";
import { RootState, store } from "../../app/store";
import React from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

interface ChatMessage {
    nickname: string;
    time: number;
    text: string;
}

export function useChat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [messageInput, setMessageInput] = useState('');
  
    const ws = useSelector((state: RootState) => state.ws.webSocket);
    const lobby = store.getState().lobby.lobbyId!;

    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const { t } = useTranslation();

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    };
  
    const sendMessage = () => {
        if (messageInput !== '' && ws) {
            ws.send(JSON.stringify({route: 'chat', data: {route: 'message', data: {nickname: store.getState().user.nickname, time: Date.now(), text: messageInput, lobbyId: lobby}}}));
            setMessageInput('');
        };
    };
  
    useEffect(() => {
        if (ws) {
            ws.addEventListener('message', (event) => {
                const res = JSON.parse(event.data);
      
                switch (res.route) {
                    case 'message':
                        let message = res.data as ChatMessage;
                        if (messages) {
                            setMessages(state => ([...state, message]));
                        }
                        break;
                    default:
                        break;
                };
            });
        }

    //   ws.onmessage = function(event) {
    //       const res = JSON.parse(event.data);
  
    //       switch (res.route) {
    //           case 'message':
    //               let message = res.data as ChatMessage;
    //               if (messages) {
    //                   setMessages(state => ([...state, message]));
    //               }
    //               break;
    //           default:
    //               break;
    //       };
    //     }
    }, []); 

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    return {
        sendMessage,
        setMessageInput,
        t,
        messageInput,
        messages,
        messagesEndRef,
    };
}