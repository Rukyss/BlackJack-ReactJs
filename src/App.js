import React from 'react';
import Game from './Componentes/Bjack'; // Importa el export por defecto de Bjack

function App() {
  return (
    <div className="App">
      <h1>BlackJack - React</h1>
      <Game /> 
    </div>
  );
}

export default App;