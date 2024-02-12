import React from 'react';
import Card from './card'; // Importa el componente Card desde el archivo donde está definido
import estilos from './estilos.css'; // Importa el archivo de estilos
import cartas from './cartitas';
import backOfCardImage from '../images/cards/back_of_card.png';


// Define los valores y palos de las cartas
const suits = ['Picas', 'Corazones', 'Rombos', 'Tréboles'];
const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Función para barajar las cartas
function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

// Componente Hand
function Hand({ cards, Jugador, gameEnded }) {
  const handValue = calculateHand(cards);
  return (
    <div className="hand">
      <h2 className="Jugador-title">{Jugador}: {Jugador === 'Jugador' || gameEnded ? handValue : ''}</h2>
      <div className="cards">
        {cards.map((card, i) => (
          <Card key={i} img={i === 1 && Jugador !== 'Jugador' && !gameEnded ? backOfCardImage : card.img} />
        ))}
      </div>
    </div>
  );
}
// Función para calcular el valor de la mano
function calculateHand(cards) {
  let sum = 0;
  for (let card of cards) {
    sum += card.value[0];
  }
  return sum;
}

// Componente principal del juego
class BlackjackGame extends React.Component {
  constructor(props) {
    super(props);
    const deck = this.createDeck();
    this.state = {
      JugadorCards: [deck.pop()],
      dealerCards: [deck.pop(), deck.pop()],
      gameResult: '',
      gameEnded: false, // Bandera para indicar si el juego ha terminado
      deck: deck // Estado para mantener el mazo de cartas
    };
  }

  // Función para crear la baraja de cartas
  createDeck() {
    let deck = [...cartas]; // Copia el array de cartas
    deck = shuffle(deck); // Baraja el mazo
    return deck;
  }

  // Función para repartir una carta al jugador
  hit = () => {
    if (!this.state.gameEnded) {
      const newCard = this.state.deck.pop(); // Extrae la carta del mazo actual
      const remainingDeck = this.state.deck; // Copia el mazo actual
      this.setState(prevState => ({
        JugadorCards: [...prevState.JugadorCards, newCard],
        deck: remainingDeck // Actualiza el mazo sin la carta repartida
      }), () => {
        const handValue = calculateHand(this.state.JugadorCards);
        if (handValue === 21) {
          this.setState({ gameResult: '¡Jugador Gana!', gameEnded: true });
        } else if (handValue > 21) {
          this.setState({ gameResult: 'Crupier gana!', gameEnded: true });
        }
      });
    }
  };

  // Función para que el crupier juegue sus cartas
  playDealer = () => {
    if (!this.state.gameEnded) {
      let dealerCards = [...this.state.dealerCards];
      let deck = this.state.deck; // Utiliza el mazo actual
      while (calculateHand(dealerCards) < 17) {
        dealerCards.push(deck.pop());
      }
      const dealerValue = calculateHand(dealerCards);
      const JugadorValue = calculateHand(this.state.JugadorCards);
      let gameResult = '';
      if (dealerValue > 21 || JugadorValue > dealerValue) {
        gameResult = '¡Jugador Gana!';
      } else if (dealerValue > JugadorValue) {
        gameResult = '¡Crupier Gana!';
      } else {
        gameResult = '¡Empate!';
      }

      // Voltea la segunda carta del crupier
      dealerCards[1].img = this.state.dealerCards[1].img;

      this.setState({ dealerCards, dealerValue, gameResult, gameEnded: true });
    }
  };

  // Función para reiniciar el juego
  resetGame = () => {
    const deck = this.createDeck();
    this.setState({
      JugadorCards: [deck.pop()],
      dealerCards: [deck.pop(), deck.pop()],
      gameResult: '',
      gameEnded: false,
      deck: deck // Restablece el mazo de cartas
    });
  };

  render() {
    return (
      <div className="tablero">
        <Hand cards={this.state.dealerCards} Jugador="Crupier" gameEnded={this.state.gameEnded} />
        <Hand cards={this.state.JugadorCards} Jugador="Jugador" />
        <div className="buttons">
          <button onClick={this.hit} disabled={this.state.gameEnded}>Pedir</button>
          <button onClick={this.playDealer} disabled={this.state.gameEnded}>Plantarse</button>
          <button onClick={this.resetGame}>Nueva Ronda</button>
        </div>
        {this.state.gameResult && <h3>{this.state.gameResult}</h3>}
      </div>
    );
  }
}

export default BlackjackGame;
