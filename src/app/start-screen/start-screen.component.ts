import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Game } from '../../models/game';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [],
  templateUrl: './start-screen.component.html',
  styleUrl: './start-screen.component.scss',
})
export class StartScreenComponent {
  constructor(private firestore: Firestore, private router: Router) {}

  newGame() {
    let game = new Game(); // start game
    this.addGame(game);
  }

  getGamesRef() {
    return collection(this.firestore, 'games');
  }

  // ADD GAME DATA TO THE FIRESTORE BACKEND
  async addGame(game: Game) {
    await addDoc(this.getGamesRef(), game.toJSON()) // collection = wohin? , param game = was?
      .then((gameRef: any) => {
        this.router.navigateByUrl('/game/' + gameRef.id);
      });
  }
}
