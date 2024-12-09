import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import { Server } from "socket.io";
import userRouter from "./routes/userRoutes.js";
import { userModel } from "./Schema/userSchema.js";
import dotenv from "dotenv";

dotenv.config();

const port= process.env.port || 4000;


const app = express();
app.use(cors());
app.use(express.json());


// Connect to MongoDB
mongoose.connect(`${process.env.mongoDb_url}`)
const server = http.createServer(app);

app.get("/", (req,res)=>{
  res.status(200).send("hello")
})

app.use("/api/user/", userRouter);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"], 
  }
});

const deck = [
  { rank: "A", suit: "spades", image: "/images/A-spade.jpg" }, { rank: "K", suit: "spades", image: "/images/k-spade.jpg" }, { rank: "Q", suit: "spades", image: "/images/q-spade.jpg" },
  { rank: "J", suit: "spades", image: "/images/j-spade.jpg" }, { rank: "10", suit: "spades", image: "/images/10-spade.jpg" }, { rank: "9", suit: "spades", image: "/images/9-spade.jpg" },
  { rank: "8", suit: "spades", image: "/images/8-spade.jpg" }, { rank: "7", suit: "spades", image: "/images/7-spade.jpg" }, { rank: "6", suit: "spades", image: "/images/6-spade.jpg" },
  { rank: "5", suit: "spades", image: "/images/5-spade.jpg" }, { rank: "4", suit: "spades", image: "/images/4-spade.jpg" }, { rank: "3", suit: "spades", image: "/images/3-spade.jpg" },
  { rank: "2", suit: "spades", image: "/images/2-spade.jpg" }, { rank: "A", suit: "hearts", image: "/images/A-heart.jpg" }, { rank: "K", suit: "hearts", image: "/images/k-heart.jpg" }, { rank: "Q", suit: "hearts", image: "/images/q-heart.jpg" },
  { rank: "J", suit: "hearts", image: "/images/j-heart.jpg" }, { rank: "10", suit: "hearts", image: "/images/10-heart.jpg" }, { rank: "9", suit: "hearts", image: "/images/9-heart.jpg" },
  { rank: "8", suit: "hearts", image: "/images/8-heart.jpg" }, { rank: "7", suit: "hearts", image: "/images/7-heart.jpg" }, { rank: "6", suit: "hearts", image: "/images/6-heart.jpg" },
  { rank: "5", suit: "hearts", image: "/images/5-heart.jpg" }, { rank: "4", suit: "hearts", image: "/images/4-heart.jpg" }, { rank: "3", suit: "hearts", image: "/images/3-heart.jpg" },
  { rank: "2", suit: "hearts", image: "/images/2-heart.jpg" }, { rank: "A", suit: "club", image: "/images/A-club.jpg" }, { rank: "K", suit: "club", image: "/images/k-club.jpg" }, { rank: "Q", suit: "club", image: "/images/q-club.jpg" },
  { rank: "J", suit: "club", image: "/images/j-club.jpg" }, { rank: "10", suit: "club", image: "/images/10-club.jpg" }, { rank: "9", suit: "club", image: "/images/9-club.jpg" },
  { rank: "8", suit: "club", image: "/images/8-club.jpg" }, { rank: "7", suit: "club", image: "/images/7-club.jpg" }, { rank: "6", suit: "club", image: "/images/6-club.jpg" },
  { rank: "5", suit: "club", image: "/images/5-club.jpg" }, { rank: "4", suit: "club", image: "/images/4-club.jpg" }, { rank: "3", suit: "club", image: "/images/3-club.jpg" },
  { rank: "2", suit: "club", image: "/images/2-club.jpg" }, { rank: "A", suit: "diamond", image: "/images/A-diamond.jpg" }, { rank: "K", suit: "diamond", image: "/images/k-diamond.jpg" }, { rank: "Q", suit: "diamond", image: "/images/q-diamond.jpg" },
  { rank: "J", suit: "diamond", image: "/images/j-diamond.jpg" }, { rank: "10", suit: "diamond", image: "/images/10-diamond.jpg" }, { rank: "9", suit: "diamond", image: "/images/9-diamond.jpg" },
  { rank: "8", suit: "diamond", image: "/images/8-diamond.jpg" }, { rank: "7", suit: "diamond", image: "/images/7-diamond.jpg" }, { rank: "6", suit: "diamond", image: "/images/6-diamond.jpg" },
  { rank: "5", suit: "diamond", image: "/images/5-diamond.jpg" }, { rank: "4", suit: "diamond", image: "/images/4-diamond.jpg" }, { rank: "3", suit: "diamond", image: "/images/3-diamond.jpg" },
  { rank: "2", suit: "diamond", image: "/images/2-diamond.jpg" }

];



const getCardValue = (card) => {
  const { rank, suit } = card;
  const rankValue = rankValues[rank];
  const suitValue = suitValues[suit];
  return rankValue + suitValue * 13;
};

const rankValues = {
  "2": 2, "3": 3, "4": 4, "5": 5, "6": 6, "7": 7, "8": 8,
  "9": 9, "10": 10, "J": 11, "Q": 12, "K": 13, "A": 14
};

const suitValues = {
  "hearts": 0,
  "diamond": 1,
  "club": 2,
  "spades": 3
};



const deckWithValues = deck.map(card => ({
  ...card,
  value: getCardValue(card)
}));



const shuffle = (deck) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

const dealCards = (deck) => deck.splice(0, 3);


const comparePlayer = (Mycards, competitorCards, competitor, userName) => {

  const player1Hand = evaluateHand(Mycards);
  const player2Hand = evaluateHand(competitorCards);
  const myarrangeValues = Mycards.map(card => getRankValue(card));
  myarrangeValues.sort((a, b) => a - b);
  const otherarrangeValues = competitorCards.map(card => getRankValue(card));
  otherarrangeValues.sort((a, b) => a - b);

  if (player1Hand.rank > player2Hand.rank) {
    return userName;
  } else if (player1Hand.rank < player2Hand.rank) {
    return competitor;
  } else {
    if (player1Hand.highCard > player2Hand.highCard) {
      return userName;
    } else if (player1Hand.highCard < player2Hand.highCard) {
      return competitor;
    } else {
      if (player1Hand.rank === 1) {
        if (myarrangeValues[1] > otherarrangeValues[1]) {
          return userName
        } else if (myarrangeValues[1] == otherarrangeValues[1]) {
          if (myarrangeValues[0] > otherarrangeValues[0]) {
            return userName;
          } else {
            return competitor;
          }
        } else {
          return competitor;
        }
      } else if (player1Hand.rank === 2) {
        const myThirdcard = myarrangeValues[0] === myarrangeValues[1] ? myarrangeValues[2] : myarrangeValues[0];
        const otherThirdCard = otherarrangeValues[0] === otherarrangeValues[1] ? otherarrangeValues[2] : otherarrangeValues[0];
        if (myThirdcard > otherThirdCard) {
          return userName;
        } else {
          return competitor;
        }
      }
      return competitor;
    }

  }
};



function getRankValue(card) {
  const cardRank = card.rank;
  return rankValues[cardRank];
}


function evaluateHand(cards) {
  // Sort to make pattern matching easier
  const arrangeValues = cards.map(card => getRankValue(card));
  arrangeValues.sort((a, b) => a - b);
  const isSameSuit = cards.every(card => card.suit === cards[0].suit);
  let isSequence = arrangeValues[2] - arrangeValues[1] === 1 && arrangeValues[1] - arrangeValues[0] === 1;
  if (arrangeValues[2] === 14 && arrangeValues[0] === 2 && arrangeValues[1] === 3) {
    isSequence = true
  }

  // Trail (three of a kind)
  if (arrangeValues[0] === arrangeValues[1] && arrangeValues[1] === arrangeValues[2]) {
    return { rank: 6, highCard: arrangeValues[2] };
  }

  // Pure Sequence (straight flush)
  if (isSameSuit && isSequence) {
    return { rank: 5, highCard: arrangeValues[2] };
  }

  // Sequence (straight)
  if (isSequence) {
    return { rank: 4, highCard: arrangeValues[2] };
  }

  // Color (flush)
  if (isSameSuit) {
    return { rank: 3, highCard: arrangeValues[2] };
  }

  // Pair
  if (arrangeValues[0] === arrangeValues[1] || arrangeValues[1] === arrangeValues[2] || arrangeValues[0] === arrangeValues[2]) {
    const pairValue = arrangeValues[0] === arrangeValues[1] ? arrangeValues[0] : arrangeValues[1];
    return { rank: 2, highCard: pairValue };
  }

  // High Card
  return { rank: 1, highCard: arrangeValues[2] };
}




let rooms = {}; // Object to track rooms and their players
let roomNo = "0";
let pot = {};
let gameStarted = {};
let winners = {};

const MAX_PLAYERS_PER_ROOM = 5;

io.on("connection", (socket) => {
  console.log("A player connected");

  socket.on("addUser", (data) => {
    let roomNo= data.user.room_no;
    if(!rooms[roomNo]){
      rooms[roomNo]=[];
    }

    rooms[roomNo].push({ name: data.user.name, cards: [], bootAmount: "", pack: true, currentTurn: "", peek: false, room_No: roomNo, id: socket.id});
    gameStarted[roomNo]= false;
    socket.join(roomNo); 
    io.to(roomNo).emit("getAllUsers", { users: rooms[roomNo], gameStarted: gameStarted[roomNo] });

  });


  socket.on("dealCards", (data) => {
    const { room_no, playerName } = data;
    const room = rooms[room_no];
    if (!gameStarted[room_no]) {
      let nextPlayerIndex = (room.findIndex(p => p.name === winners[room_no]) + 1) % room.length;
      gameStarted[room_no] = true;
      const shuffledCards = shuffle(deckWithValues);
      room.forEach((user) => {
        const userCards = dealCards(shuffledCards);
        user.cards = userCards;
        user.pack = false;
        user.bootAmount = 10;
        if (winners[room_no] == "") {
          user.currentTurn = playerName;
        } else {
          user.currentTurn = room[nextPlayerIndex].name;
        }
        pot[room_no] = pot[room_no] + 10;
      });

      if (room.length >= 3) {
        io.to(room_no).emit("setShow", { sideShow: true })
      }

      io.to(room_no).emit("startGame", { users: room, pot: pot[room_no] });
    }
  });

  socket.on("restartGame", (data) => {
    const { room_no, winner } = data;
    const room = rooms[room_no];
    room.forEach(player => {
      player.pack = false;
      player.peek = false;
      player.bootAmount = "";
      player.cards = [];
      player.currentTurn = "";
    });

    pot[room_no] = 0;
    gameStarted[room_no] = false;
    winners[room_no] = winner;
    io.to(room_no).emit("getAllUsers", { users: room, gameStarted: gameStarted[room_no] });
  });


  socket.on("pack", (data) => {
    const { room_no, playerName } = data;
    io.to(room_no).emit("packPress", { playerName });
    const room = rooms[room_no];
    // Find the index of the player
    const index = room.findIndex(player => player.name === playerName);

    let nextPlayerIndex = (room.findIndex(p => p.name === playerName) + 1) % room.length;
    while (room[nextPlayerIndex].pack) {
      nextPlayerIndex = (room.findIndex(p => p.name === room[nextPlayerIndex].name) + 1) % room.length;
    }
    room.forEach(user => {
      user.currentTurn = room[nextPlayerIndex].name;
    })
    room[index].pack = true;
    let remainingPlayer = room.filter(player => !player.pack).length;

    if (remainingPlayer == 1) {
      io.to(room_no).emit("winner", { winner: room[nextPlayerIndex].name });
    } else {
      io.to(room_no).emit("updateUsers", { users: room })
      if (remainingPlayer == 2) {
        io.to(room_no).emit("setShow", { sideShow: false })
      }
    }
  });

  socket.on("blind", (data) => {
    let { room_no, userName, double, bootAmount, bet } = data;
    io.to(room_no).emit("blindPress", { playerName: userName, double, bet });
    const room = rooms[room_no];

    if (double) {
      bootAmount = bootAmount * 2;
    }

    pot[room_no] += bootAmount;
    io.to(room_no).emit("updatePot", pot[room_no]);


    let nextPlayerIndex = (room.findIndex(p => p.name === userName) + 1) % room.length;
    while (room[nextPlayerIndex].pack) {
      nextPlayerIndex = (room.findIndex(p => p.name === room[nextPlayerIndex].name) + 1) % room.length;
    }

    room.forEach(user => {
      user.bootAmount = bootAmount;
      user.currentTurn = room[nextPlayerIndex].name;
    })

    io.to(room_no).emit("updateUsers", { users: room });

  });


  socket.on("peek", (data) => {
    const { room_no, playerName, bootAmount } = data;
    const room = rooms[room_no];
    const index = room.findIndex(player => player.name === playerName);
    room[index].peek = true;
    room[index].bootAmount = bootAmount * 2;
    io.to(room_no).emit("updateUsers", { users: room });
  });

  socket.on("showRequest", (data) => {
    const { room_no, playerName } = data;
    const room = rooms[room_no];
    const currentPlayerIndex = room.findIndex(p => p.name === playerName);
    let previousPlayerIndex = (currentPlayerIndex - 1 + room.length) % room.length;

    while (room[previousPlayerIndex].pack) {
      previousPlayerIndex = (previousPlayerIndex - 1 + room.length) % room.length;
    }
    if(room[previousPlayerIndex].peek){

    io.to(room_no).emit("askRequest", { playerName, previousPlayer: room[previousPlayerIndex].name });
    }else{
      io.to(room_no).emit("decline", {playerName, message: "Not possible! Player is blind"});
    }
  });

  socket.on("show", (data) => {
    const { room_no, playerName, bootAmount, option } = data;
    const room = rooms[room_no];

    if(option==="yes"){

    pot[room_no] += bootAmount * 2;
    io.to(room_no).emit("updatePot", pot[room_no]);

    const currentPlayerIndex = room.findIndex(p => p.name === playerName);
    let previousPlayerIndex = (currentPlayerIndex - 1 + room.length) % room.length;

    // Find the previous player who is not packed
    while (room[previousPlayerIndex].pack) {
      previousPlayerIndex = (previousPlayerIndex - 1 + room.length) % room.length;
    }

    const currentPlayerCards = room[currentPlayerIndex].cards;
    const previousPlayerCards = room[previousPlayerIndex].cards;

    const winner = comparePlayer(currentPlayerCards, previousPlayerCards, room[previousPlayerIndex].name, room[currentPlayerIndex].name);

    if (winner === playerName) {
      // If the current player wins, mark the previous player as packed
      room[previousPlayerIndex].pack = true;
    } else {
      // If the previous player wins, mark the current player as packed
      room[currentPlayerIndex].pack = true;
    }

    // Determine the next player and check remaining players
    let nextPlayerIndex = (currentPlayerIndex + 1) % room.length;
    while (room[nextPlayerIndex].pack) {
      nextPlayerIndex = (nextPlayerIndex + 1) % room.length;
    }

    room.forEach(user => {
      user.currentTurn = room[nextPlayerIndex].name;
    })

    io.to(room_no).emit("showCards", { playerName, otherPlayer: room[previousPlayerIndex].name });

    setTimeout(() => {
      const remainingPlayers = room.filter(player => !player.pack);

      if (remainingPlayers.length === 1) {
        io.to(room_no).emit("winner", { winner: remainingPlayers[0].name });
      } else if (remainingPlayers.length === 2) {
        io.to(room_no).emit("setShow", { sideShow: false });
        
      }else{
        io.to(room_no).emit("updateUsers", { users: room });
      }
    }, 2000);
  }else{
    io.to(room_no).emit("decline", {playerName, message: "declined"});
  }

  });


  socket.on("chat", (data) => {
    const { room_no, playerName, userName, message } = data;
    io.to(room_no).emit("recieveChat", { playerName, userName, message })

  });

  socket.on("exitRoom", async(data)=>{
    const room= rooms[data.room_no];
    const user= await userModel.findOne({name: data.name});
    user.room_no=null;
    await user.save();
    const index= room.findIndex(player=> player.name== data.name);
    room.splice(index, 1);
    io.to(data.room_no).emit("updateUsers", { users: room });
  });



  socket.on("disconnect", () => {
    for (let room in rooms) {
      const playerIndex = rooms[room].findIndex(player => player.id === socket.id);
      if (playerIndex !== -1) {
        if (rooms[room].length === 1) {
          delete rooms[room]; 
        } else {
          rooms[room].splice(playerIndex, 1);
        }
        break;
      }
    };
  });

});

// Listen on port 4000
server.listen(port, () => {
  console.log("Server is listening on port 4000");
});
