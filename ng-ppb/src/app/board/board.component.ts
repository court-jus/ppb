import { Component, OnInit, Input } from '@angular/core';
import { Cell } from '../cell';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @Input() level: number;
  width: number;
  height: number;
  cells: Cell[];
  curpos: number;
  debug: string;
  status: number;

  constructor() {
    this.newGame();
  }

  choice(list: any[]): any {
    return list[Math.floor(Math.random() * list.length)];
  }

  randint(max: number): number {
    return Math.floor(Math.random() * max);
  }

  newGame() {
    let side_to_start: number = this.randint(2);
    let where_to_start: number;
    let where_to_end: number;
    this.width = (this.level - 1) * 2 + 4;
    this.height = (this.level - 1) * 2 + 4;
    if (side_to_start === 0) {
      // Start on top
      where_to_start = this.randint(this.width);
      where_to_end = this.randint(this.width) + (this.height - 1) * this.width;
    } else {
      // Start left
      where_to_start = this.randint(this.height) * this.width;
      where_to_end = ((this.randint(this.height) + 1) * this.width) - 1;
    }

    this.cells = [];
    for(let row = 0; row < this.height; row++) {
      for(let col = 0; col < this.width; col++) {
        let idx = row * this.width + col;
        let cell = new Cell();
        cell.id = idx;
        if (idx === where_to_start) {
          cell.type = 1;
        } else if (idx === where_to_end) {
          cell.type = 2;
        }
        this.cells[idx] = cell;
      }
    }
    this.status = 0;
    window.setTimeout(() => {
      this.status = 1;
    }, 1500);
  }

  ngOnInit() {
  }

  click(cell: Cell) {
    let index = cell.id;
    console.log(cell, index, this.curpos, this.width, this.status, this.status === 1, cell.type, cell.type=== 1);
    if ((this.status === 1) && (cell.type === 1)) {
    console.log("A");
      this.status = 2;
      this.curpos = index;
      cell.visited = true;
    } else if (
      (this.status === 2) &&
      ((index === this.curpos + this.width) ||
       (index === this.curpos - this.width) ||
       (index === this.curpos + 1) ||
       (index === this.curpos - 1))
    ) {
    console.log("B");
      this.curpos = index;
      cell.visited = true;
      if (cell.type === 2) {
    console.log("C");
        this.status = 3;
      } else if (cell.type === 3) {
    console.log("D");
        this.status = 4;
      }
    }
  }

}
