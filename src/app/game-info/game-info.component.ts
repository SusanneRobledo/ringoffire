import { Component, OnChanges, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Input } from '@angular/core';

@Component({
  selector: 'app-game-info',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './game-info.component.html',
  styleUrl: './game-info.component.scss',
})
export class GameInfoComponent implements OnInit, OnChanges {
  cardAction = [
    {
      title: 'Waterfall',
      description:
        'Everyone drinks. The person who drew the card starts, and everyone must keep drinking until the person to their right stops.',
    },
    { title: 'You', description: 'Pick someone to drink.' },
    { title: 'Me', description: 'Take a drink.' },
    {
      title: 'Category',
      description:
        "Choose a category, like colors or animals. Each player must say something from that category. First player who can't think of anything drinks.",
    },
    {
      title: 'Bust a Jive',
      description:
        'Start a dance move. The next player repeats the dance move and adds a second one, and so on.',
    },
    { title: 'Girls', description: 'All female players drink.' },
    { title: 'Boys', description: 'All male players drink.' },
    {
      title: 'Heaven',
      description: 'Everyone points to the sky. Last person to do so drinks.',
    },
    { title: 'Mate', description: 'Choose a mate. They drink when you do.' },
    {
      title: 'Thumbmaster',
      description:
        'You become the Thumb Master. Place your thumb on the table at any time. Last to do so drinks.',
    },
    {
      title: 'Quizmaster',
      description:
        'You become the Quizmaster. Ask questions. Anyone who answers drinks.',
    },
    {
      title: 'Rhyme Time',
      description:
        'Say a word. Players go around rhyming with it. First to fail drinks.',
    },
    {
      title: 'Rule',
      description: 'Make a rule. Everyone who breaks it, drinks.',
    },
  ];

  title = '';
  description = '';
  @Input() card!: string;

  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    if (this.card) {
      let cardNumber = +this.card.split('_')[1];
      this.title = this.cardAction[cardNumber - 1].title;
      this.description = this.cardAction[cardNumber - 1].description;
    }
  }
}
