import React, { useState, useEffect, useRef } from 'react';
import './SnakeGame.css';

const SnakeGame = () => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [speed, setSpeed] = useState(200);
  const boardSize = 20;
  const gameRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      moveSnake();
    }, speed);

    return () => clearInterval(gameLoop);
  }, [snake, direction, speed]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { x: newSnake[0].x + direction.x, y: newSnake[0].y + direction.y };

    if (head.x === food.x && head.y === food.y) {
      newSnake.push({});
      setFood({
        x: Math.floor(Math.random() * boardSize),
        y: Math.floor(Math.random() * boardSize),
      });
      if (speed > 50) setSpeed(speed - 10); // Increase speed as the snake eats food
    }

    for (let i = newSnake.length - 1; i > 0; i--) {
      newSnake[i] = { ...newSnake[i - 1] };
    }
    newSnake[0] = head;

    if (isCollision(newSnake)) {
      alert('Game Over');
      setSnake([{ x: 10, y: 10 }]);
      setDirection({ x: 1, y: 0 });
      setFood({ x: 15, y: 15 });
      setSpeed(200);
    } else {
      setSnake(newSnake);
    }
  };

  const isCollision = (newSnake) => {
    const head = newSnake[0];
    if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
      return true;
    }
    for (let i = 1; i < newSnake.length; i++) {
      if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
        return true;
      }
    }
    return false;
  };

  return (
    <div ref={gameRef} className="game-board">
      {Array.from({ length: boardSize }).map((_, row) => (
        <div key={row} className="board-row">
          {Array.from({ length: boardSize }).map((_, col) => {
            const isSnake = snake.some((segment) => segment.x === col && segment.y === row);
            const isFood = food.x === col && food.y === row;
            return (
              <div
                key={col}
                className={`board-cell ${isSnake ? 'snake-cell' : ''} ${isFood ? 'food-cell' : ''}`}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default SnakeGame;
