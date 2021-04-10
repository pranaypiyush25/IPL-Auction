import React, { useState, useEffect } from "react";
import {
  Typography,
  Paper,
  Grid,
  AppBar,
  Toolbar,
  Button,
} from "@material-ui/core";
import ReactRoundedImage from "react-rounded-image";
import useStyles from "./AuctionRoom.styles";
import { Player } from "../PlayerDisplay/PlayersDisplay";
import firebase from "../../Firebase";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useHistory, useParams, NavLink } from "react-router-dom";

function AuctionRoom() {
  const classes = useStyles();
  const [teamPlayers, setTeamPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState({
    playerName: "",
    basePrice: 0,
    currentBid: 0,
    image_url: "",
    role: "",
    teamName: "",
    rating: "",
    id: "",
    soldTo: "",
    status: ""
  });
  const nick = localStorage.getItem("nickName");
  const { room } = useParams();
  const history = useHistory();

  const renderPlayers = async () => {
    firebase
      .database()
      .ref("users/")
      .orderByChild("nickName")
      .equalTo(nick)
      .on("value", (snapshot) => {
        setTeamPlayers([]);
        const players = snapshotToArray(snapshot);
        const playa = players.find((x) => x.nickName === nick);
        const team = playa.team != null ? playa.team : [];
        console.log(team);
        setTeamPlayers(team);
      });
  };

  const snapshotToArray = (snapshot) => {
    const returnArr = [];

    snapshot.forEach((childSnapshot) => {
      const item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
    });

    return returnArr;
  };

  useEffect(() => {
    renderPlayers();
    renderCurrentPlayer();
  }, []);

  const renderCurrentPlayer = async () => {
    firebase
      .database()
      .ref("rooms/")
      .on("value", (snapshot) => {
        const crntRooms = snapshotToArray(snapshot);
        const crntRoom = crntRooms.find((x) => x.roomname === room);
        setCurrentPlayer({
          playerName: crntRoom.currentPlayer.playerName,
          basePrice: crntRoom.currentPlayer.basePrice,
          currentBid: crntRoom.currentPlayer.currentBid,
          image_url: crntRoom.currentPlayer.image_url,
          role: crntRoom.currentPlayer.role,
          teamName: crntRoom.currentPlayer.teamName,
          rating: crntRoom.currentPlayer.rating,
          soldTo: crntRoom.currentPlayer.soldTo,
            status: crntRoom.currentPlayer.status,
            id: crntRoom.currentPlayer.id
        });
      });
  };

  const exitRoom = () => {
    history.goBack();
  };

  const changeBidByFive = () => {
    firebase
    .database()
    .ref("rooms/")
    .once("value", (snapshot) => {
      let crntRooms = snapshotToArray(snapshot);
      let crntRoom = crntRooms.find((x) => x.roomname === room);

      const userRef = firebase.database().ref("rooms/" + crntRoom.key);
      console.log(userRef)
      userRef.update({highestBidder: nick});
      const bidRef = firebase.database().ref("rooms/" + crntRoom.key);
      bidRef.update({
          currentPlayer:{
              ...currentPlayer,
              currentBid: (currentPlayer.currentBid+5)
          }
      })
    });
  }

  const changeBidByTen = () => {
    firebase
    .database()
    .ref("rooms/")
    .once("value", (snapshot) => {
      let crntRooms = snapshotToArray(snapshot);
      let crntRoom = crntRooms.find((x) => x.roomname === room);

      const userRef = firebase.database().ref("rooms/" + crntRoom.key);
      console.log(userRef)
      userRef.update({highestBidder: nick});

      const bidRef = firebase.database().ref("rooms/" + crntRoom.key);
      bidRef.update({
          currentPlayer:{
              ...currentPlayer,
              currentBid: (currentPlayer.currentBid+10)
          }
      })
    });
  }

  const changeBidByFifteen = () => {
    firebase
    .database()
    .ref("rooms/")
    .once("value", (snapshot) => {
      let crntRooms = snapshotToArray(snapshot);
      let crntRoom = crntRooms.find((x) => x.roomname === room);

      const userRef = firebase.database().ref("rooms/" + crntRoom.key);
      console.log(userRef)
      userRef.update({highestBidder: nick});
    
      const bidRef = firebase.database().ref("rooms/" + crntRoom.key);
      bidRef.update({
          currentPlayer:{
              ...currentPlayer,
              currentBid: (currentPlayer.currentBid+15)
          }
      })
    });
  }
  return (
    <Grid container justify="flex-start">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Welcome {nick} to IPL Auction Presented by DORA
          </Typography>
          <Button color="inherit" component={NavLink} to="/playerlist">
            All Players
          </Button>
          <Button
            color="inherit"
            endIcon={<ExitToAppIcon />}
            onClick={exitRoom}
          >
            Leave Room
          </Button>
        </Toolbar>
      </AppBar>
      <Grid item lg={6} className={classes.leftSide}>
        {currentPlayer === "none" ? (
          <Typography variant="h2">Auction Not Started</Typography>
        ) : (
          <Grid container direction="column">
            <Grid item className={classes.headingLul}>
              <div className={classes.heading}>
                <Typography variant="h3">Remaining Purse: 50</Typography>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Paper className={classes.innerContainer}>
                <Grid
                  container
                  direction="column"
                  justify="center"
                  spacing={2}
                  alignItems="center"
                >
                  <Grid item xs={12}>
                    <ReactRoundedImage
                      imageWidth="180"
                      imageHeight="180"
                      roundedColor="#000"
                      roundedSize="6"
                      image={currentPlayer.image_url}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h4" style={{ margin: "10px 0px" }}>
                      {currentPlayer.playerName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Role: {currentPlayer.role}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Rating: {currentPlayer.rating}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Base Price: {currentPlayer.basePrice}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="h5">
                      Current Bid: {currentPlayer.currentBid}
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "10px 10px" }}
                  onClick={changeBidByFive}
                >
                  Increase +5
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "10px 10px" }}
                  onClick={changeBidByTen}
                >
                  Increase +10
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  style={{ margin: "10px 10px" }}
                  onClick={changeBidByFifteen}
                >
                  Increase +15
                </Button>
              </div>
            </Grid>
          </Grid>
        )}
      </Grid>
      <Grid item lg={6} className={classes.rightSide}>
        <Grid item className={classes.headingLul}>
          <div className={classes.heading}>
            <Typography variant="h3">My Team</Typography>
          </div>
        </Grid>
        <Grid container alignItems="center">
          {teamPlayers.map((player, index) => {
            return <Player key={index} player={player} />;
          })}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default AuctionRoom;
