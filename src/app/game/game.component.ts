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
  game!: Game; //Object hier verknüpft von Models > game.ts
  gameId: string = '';

  firestore: Firestore = inject(Firestore);

  unsubSingleGame: any;

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {}

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
          const gameData = game.data();
          this.game.players = gameData.players;
          this.game.stack = gameData.stack;
          this.game.playedCards = gameData.playedCards;
          this.game.currentPlayer = gameData.currentPlayer;
          this.game.takeCardAnimation = gameData.takeCardAnimation;
          this.game.currentCard = gameData.currentCard;
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
      takeCardAnimation: obj.takeCardAnimation || '',
      currentCard: obj.currentCard || '',
    };
  }

  getSingleGameRef(colId: string, gameId: string) {
    return doc(collection(this.firestore, colId), gameId);
  }

  newGame() {
    this.game = new Game();
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
      takeCardAnimation: gameData.takeCardAnimation,
      currentCard: gameData.currentCard,
    });
  }

  takeCard() {
    if (!this.game.takeCardAnimation) {
      this.game.currentCard = this.game.stack.pop()!;
      this.game.takeCardAnimation = true;

      this.game.currentPlayer++;
      this.game.currentPlayer =
        this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.takeCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name); // checkt im ersten Schritt: existiert die Variable?
        this.saveGame();
      }
    });
  }
}
