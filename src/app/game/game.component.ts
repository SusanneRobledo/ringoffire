import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Game } from '../../models/game';
import { PlayerComponent } from '../player/player.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { GameInfoComponent } from '../game-info/game-info.component';
import {
  Firestore,
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    CommonModule,
    PlayerComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    GameInfoComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss',
})
export class GameComponent {
  takeCardAnimation = false;
  currentCard: string = '';
  game!: Game; //Object hier verknüpft von Models > game.ts
  gameId: string = '';

  firestore: Firestore = inject(Firestore);

  unsubSingleGame: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

  // ADD GAME DATA TO THE FIRESTORE BACKEND
  async addGame(game: Game) {
    await addDoc(this.getGamesRef(), game.toJSON()) // collection = wohin? , param game = was?
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Dokument written with ID:', docRef?.id);
      });
  }

  ngOnDestroy() {
    this.unsubSingleGame();
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
      this.gameId = params['id'];
      //READ DATA IN FIRESTORE BACKEND
      this.unsubSingleGame = onSnapshot(
        this.getSingleGameRef('games', this.gameId),
        (game: any) => {
          console.log(this.game.toJSON());
          let gameData = game.data();
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
          this.game.playedCards = gameData.playedCards;
          this.game.currentPlayer = gameData.currentPlayer;
        }
      );
    });
  }

  subGame() {
    return onSnapshot(
      this.getSingleGameRef('games', this.gameId),
      (element) => {
        console.log(element);
      }
    );
  }

  setGameObject(obj: any) {
    return {
      players: obj.players || '',
      stack: obj.stack || '',
      playedCards: obj.playedCards || '',
      currentPlayer: obj.currentPlayer || '',
      game: obj.game || '',
    };
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId: string, gameId: string) {
    return doc(collection(this.firestore, colId), gameId);
  }

  newGame() {
    this.game = new Game();
    //this.addGame(this.game);
  }

  // UPDATE GAME DATA TO THE FIRESTORE BACKEND
  async saveGame() {
    const gameData: any = this.game.toJSON();
    let docRef = this.getSingleGameRef('games', this.gameId);
    await updateDoc(docRef, {
      players: gameData.players,
      stack: gameData.stack,
      playedCards: gameData.playedCards,
      currentPlayer: gameData.currentPlayer,
      currentCard: gameData.currentCard,
    });
  }

  takeCard() {
    if (!this.takeCardAnimation) {
      this.currentCard = this.game.stack.pop()!;
      this.takeCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;

      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.takeCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name); // checkt im ersten Schritt: existiert die Variable?
      }
    });
  }
}
