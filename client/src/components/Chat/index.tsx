import React from 'react';
import { useChat } from './useChat';

export const Chat = () => {
    const {
        sendMessage,
        setMessageInput,
        messageInput,
        messages,
        messagesEndRef,
        t,
    } = useChat();

  return (
    <div className="w-full px-2 flex justify-center items-center flex-col">
      <p>{t('lobby.chat.title')}</p>
      <div className="w-full px-3 py-3 border-[2px] border-orange-600 rounded-t-[6px] overflow-scroll min-h-60 max-h-60">
        <div className="flex flex-col justify-center items-center gap-2 w-full">
          {messages.map((message, index) => ( 
            <div key={index} className='w-full'>
                <div className='flex flex-row justify-between items-center'>
                    <p className='font-bold text-base'>{t(message.nickname)}</p>
                    <p className='text-sm text-gray-700'>{new Date(message.time).toTimeString().slice(-1000, 5)}</p>
                </div>
                <p>{message.text}</p>
            </div>
          ))}
            <div ref={messagesEndRef}/>
        </div>
      </div>
      <div className="bg-orange-600 p-2 rounded-b-[6px] flex items-center justify-center gap-2 w-full">
          <input
            className='border-orange-900 p-2 border-[2px] rounded-[6px] w-3/4'
            type="text"
            placeholder={t('lobby.chat.placeholder')}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
          />
          <button className='w-1/4 bg-orange-700 border-[2px] text-white font-bold border-orange-900 rounded-[6px]' onClick={sendMessage}>{t('lobby.chat.send')}</button>
        </div>
    </div>
  );
};