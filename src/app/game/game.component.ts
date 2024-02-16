import { Component, inject } from '@angular/core';
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

  firestore: Firestore = inject(Firestore);

  unsubList;
  unsubSingle;

  constructor(public dialog: MatDialog) {
    this.unsubList = onSnapshot(this.getGamesRef(), (list) => {
      list.forEach((element) => {
        console.log(element.data());
      });
    });

    this.unsubSingle = onSnapshot(
      this.getSingleGameRef('games', 'ZFiSGC3A2yweZ8EArAhc'),
      (element) => {
        console.log(element);
      }
    );
  }

  async addGame(item: Game) {
    await addDoc(this.getGamesRef(), item)
      .catch((err) => {
        console.error(err);
      })
      .then((docRef) => {
        console.log('Dokument written with ID:', docRef?.id);
      });
  }

  ngOnDestroy() {
    this.unsubList();
    this.unsubSingle();
  }

  ngOnInit(): void {
    this.newGame();
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  getSingleGameRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }

  newGame() {
    this.game = new Game();
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
      if (name && name.length > 0) this.game.players.push(name); // checkt im ersten Schritt: existiert die Variable?
    });
  }
}
