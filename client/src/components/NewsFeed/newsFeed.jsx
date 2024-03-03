import React, { useState, useEffect } from 'react';
import useMakeOrders from "../../hooks/useMakeOrders";
import useFutureSymbols from '../../hooks/useFutureSymbols';
import useNewsTerminal from '../../hooks/useNewsTerminal';
import useNewsBwe from '../../hooks/useNewsBwe';
import CoinPriceVariation from './CoinPriceVariation/coinPriceVariation';
import './newsFeed.css';
import arkhamImage from './img/arkham.png';
import blogsImage from './img/blogs.png';
import binanceImage from './img/binance.png';
import bithumbImage from './img/bithumb.png';
import bloombergImage from './img/bloomberg.png';
import coinbaseImage from './img/coinbase.png';
import leaderboardImage from './img/leaderboard.png';
import proposalsImage from './img/proposals.png';
import scrapersImage from './img/scrapers.png';
import upbitImage from './img/upbit.png';
import terminalImage from './img/terminal.png';
import usgovImage from './img/usgov.png';
import pricealert from './img/pricealert.png';

const defaultImages = {
  "arkham": arkhamImage,
  "blogs": blogsImage,
  "binance": binanceImage,
  "binance en": binanceImage,
  "bithumb": bithumbImage,
  "bloomberg": bloombergImage,
  "coinbase": coinbaseImage,
  "leaderboard": leaderboardImage,
  "proposals": proposalsImage,
  "scrapers": scrapersImage,
  "upbit": upbitImage,
  "usgov": usgovImage,
  "terminal": terminalImage,
  "price monitor": pricealert
};

const specialSymbols = ["PEPE", "FLOKI", "BONK", "SATS", "RATS", "SHIB", "XEC"];

const MessageWithTimer = ({ message }) => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showTimer, setShowTimer] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed((oldTime) => oldTime + 1);
    }, 1000);

    const timeout = setTimeout(() => {
      setShowTimer(false);
    }, 31000);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, []);

  if (!showTimer) {
    return null;
  }

  let timerClass = "";
  if (timeElapsed <= 6) {
    timerClass = "green";
  } else if (timeElapsed <= 15) {
    timerClass = "yellow";
  } else {
    timerClass = "red";
  }

  return (
    <div className={`timer ${timerClass}`}>{timeElapsed}</div>
  );
};




const NewsFeed = () => {
  const { createLongOrder, createShortOrder } = useMakeOrders();
  const { data: futSymbols } = useFutureSymbols();
  const { messages: terminalMessages } = useNewsTerminal();
  const { messages: bweMessages } = useNewsBwe();


  const handleLongClick = (coin) => {
    const isSpecialSymbol = specialSymbols.includes(coin);
    const symbolLabel = isSpecialSymbol ? `1000${coin}/USDT` : `${coin}/USDT`;

    const symbolExists = futSymbols.some(symbol => symbol.label === symbolLabel);
    if (symbolExists) {
      const symbolObject = { label: symbolLabel };
      createLongOrder(symbolObject, "LIMITUP", 30000, null, null);
    }
  };


  const handleShortClick = (coin) => {
    const isSpecialSymbol = specialSymbols.includes(coin);
    const symbolLabel = isSpecialSymbol ? `1000${coin}/USDT` : `${coin}/USDT`;

    const symbolExists = futSymbols.some(symbol => symbol.label === symbolLabel);
    if (symbolExists) {
      const symbolObject = { label: symbolLabel };
      createShortOrder(symbolObject, "LIMITUP", 30000, null, null);
    }
  };



  const mergedMessages = [...terminalMessages, ...bweMessages].sort((a, b) => {
    return new Date(b.time) - new Date(a.time);
  });


  const getCoinsFromMessage = (message) => {
    const coinsSet = new Set();

    if (message.coin) {
      coinsSet.add(message.coin);
    }

    if (message.suggestions) {
      message.suggestions.forEach(suggestion => {
        if (suggestion.coin) {
          coinsSet.add(suggestion.coin);
        }
      });
    }
    return Array.from(coinsSet);
  };


  const parseBody = (body) => {
    const urlRegex = /(https:\/\/t\.co\/|https:\/\/twitter\.com\/\S+\/status\/)[^\s\\]*(\\n)?/gi;

    let updatedBody = body?.replace(urlRegex, (match) => {
      return match.endsWith('\\n') ? '\n' : '';
    });

    updatedBody = updatedBody?.replace(/\\n/g, '\n');

    let [mainPart, quotePart] = updatedBody?.split(/\n?Quote \[/) || [updatedBody, null];

    mainPart = mainPart?.split('\n').map((line, index) => (
      <p key={index}>{line.trim() === '' ? '\u00A0' : line}</p>
    ));

    if (quotePart) {
      quotePart = quotePart.replace(urlRegex, '');
      quotePart = quotePart.replace(/\([^)]*\)/, '');

      const authorMatch = quotePart.match(/^(\S+?)\]/);
      const author = authorMatch ? authorMatch[1] : '';
      quotePart = quotePart.substring(authorMatch[0].length);

      quotePart = quotePart.split('\n').map(line => line.replace(/^>\s?/, '').trim()).filter(line => line);

      quotePart = (
        <div className="quote-section">
          <p className="quote-author">{author}</p>
          {quotePart.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      );
    }

    return { mainPart, quotePart };
  };



  const formatTitle = (title) => {
    const match = title?.match(/^(.*?)\s*(\(|@)/);
    return match ? match[1] : title;
  };

  const getImageUrl = (message) => {
    if (message.icon) {
      return message.icon;
    } else {
      const sourceKey = (message.source || "generic").toLowerCase();
      return defaultImages[sourceKey] || defaultImages["generic"];
    }
  };

  const getLinkUrl = (message) => {
    return message.link || message.url;
  };


  return (
    <div className="news-feed">
      {mergedMessages.map((message) => {
        if (!message.title) {
          return null;
        }

        const parsedBody = parseBody(message.title);

        return (
          <div key={message._id} className="message-container">
            <div className="icon-container">
              <img src={getImageUrl(message)} alt="Icon" className="message-icon" />
            </div>
            <div className="message-content">
              <a href={getLinkUrl(message)} target="_blank" rel="noopener noreferrer" className="message-body-link">
                <div className="message-body">{parsedBody.mainPart}</div>
              </a>
              {message.image && (
                <div className="message-image-container">
                  <img src={message.image} alt="Message Content" className="message-image" />
                </div>
              )}
              {parsedBody.quotePart && (
                <div className="quoted-message">
                  {parsedBody.quotePart}
                </div>
              )}
              <div className="message-coins">
                {getCoinsFromMessage(message).map((coin, index) => {
                  return (
                    <div key={index} className="coin-container">
                      <div className="coin">
                        {coin} <CoinPriceVariation coin={coin} />
                      </div>
                      <button className="coin-button green-button" onClick={() => handleLongClick(coin)}>30k</button>
                      <button className="coin-button red-button" onClick={() => handleShortClick(coin)}>30k</button>
                    </div>
                  );
                })}
              </div>
              <div className="message-footer">
                <div className="message-source-date">
                  <div className="message-source">{formatTitle(message.source)}</div>
                  <div className="message-date">- {new Date(message.time).toLocaleString()}</div>
                </div>
                <MessageWithTimer message={message} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default NewsFeed;




