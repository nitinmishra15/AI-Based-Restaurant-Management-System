import React, { useState } from 'react';
import { X, Send } from 'lucide-react';

export default function AIAssistantModal({ isOpen, onClose, onAddToOrder }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: "Hello! I am CulinaryAI, your dining assistant. How can I help you today? You can ask me to recommend spicy food, hot drinks, or vegetarian items."
    }
  ]);
  const [inputVal, setInputVal] = useState('');

  if (!isOpen) return null;

  const handleSend = () => {
    if (inputVal.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: inputVal
    };

    setMessages(prev => [...prev, userMessage]);
    const currentQuery = inputVal.toLowerCase();
    setInputVal('');

    // Simple delay for AI reply
    setTimeout(() => {
      let aiText = "Sorry, I am not sure about that. Try asking for 'spicy', 'vegetarian', 'drinks', or 'dessert'!";
      let recommendedDish = null;

      if (currentQuery.includes('spicy')) {
        aiText = "We highly recommend the Paneer Tikka Platter! It is grilled to perfection with bell peppers and onions.";
        recommendedDish = {
          id: 'paneer-tikka-platter',
          name: 'Paneer Tikka Platter',
          price: 350,
          image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=300'
        };
      } else if (currentQuery.includes('veg')) {
        aiText = "Our classic vegetarian item is the Masala Dosa! Served crispy with potato filling, coconut chutney, and sambar.";
        recommendedDish = {
          id: 'masala-dosa',
          name: 'Masala Dosa',
          price: 150,
          image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=300'
        };
      } else if (currentQuery.includes('dessert') || currentQuery.includes('sweet')) {
        aiText = "You must try our Gulab Jamun Cheesecake! It is a delicious fusion dessert.";
        recommendedDish = {
          id: 'gulab-jamun-cheesecake',
          name: 'Gulab Jamun Cheesecake',
          price: 220,
          image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=300'
        };
      } else if (currentQuery.includes('drink') || currentQuery.includes('chai') || currentQuery.includes('lassi')) {
        aiText = "Try our Mango Lassi! Or if you want something hot, order a Masala Cutting Chai.";
        recommendedDish = {
          id: 'mango-lassi',
          name: 'Mango Lassi',
          price: 150,
          image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=300'
        };
      }

      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'ai',
          text: aiText,
          dish: recommendedDish
        }
      ]);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Background Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black bg-opacity-40"
      />

      {/* Chat Box Panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-[400px] bg-white flex flex-col justify-between shadow-2xl p-6 font-sans">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#2D2F2F]">Ask CulinaryAI</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Chat Message List */}
        <div className="flex-grow overflow-y-auto py-4 space-y-3">
          {messages.map((m) => (
            <div 
              key={m.id} 
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`p-3 rounded-2xl text-xs max-w-[80%] ${
                m.sender === 'user' 
                  ? 'bg-[#B41B00] text-white rounded-tr-none' 
                  : 'bg-gray-100 text-[#2D2F2F] rounded-tl-none'
              }`}>
                {m.text}
              </div>

              {/* Recommended Dish Box */}
              {m.dish && (
                <div className="mt-2 p-2 bg-[#FFF0ED] border border-red-100 rounded-xl flex gap-2 items-center w-full max-w-[80%]">
                  <img 
                    src={m.dish.image} 
                    alt={m.dish.name} 
                    className="w-10 h-10 object-cover rounded-lg"
                  />
                  <div className="flex-grow">
                    <p className="text-[11px] font-bold text-gray-800">{m.dish.name}</p>
                    <p className="text-[10px] text-[#B41B00] font-bold">₹{m.dish.price}</p>
                  </div>
                  <button 
                    onClick={() => onAddToOrder(m.dish)}
                    className="bg-[#B41B00] text-white text-[10px] px-2 py-1 rounded hover:bg-[#FF775D] transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="border-t border-gray-200 pt-4 flex gap-2">
          <input
            type="text"
            placeholder="Type 'spicy', 'veg', 'drinks'..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-grow border border-gray-300 rounded-full px-4 py-2 text-xs focus:outline-none focus:border-[#B41B00]"
          />
          <button
            onClick={handleSend}
            className="bg-[#B41B00] hover:bg-[#FF775D] text-white p-2 rounded-full flex items-center justify-center"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
