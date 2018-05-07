import { Component, OnInit, Input } from '@angular/core';
import { Cell } from '../cell';
import { Router } from '@angular/router';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  @Input() level: number;
  stars: number = 0;
  width: number;
  height: number;
  cells: Cell[];
  curpos: number;
  debug: string;
  status: number;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.newGame(this.level);
  }

  choice(list: any[]): any {
    return list[Math.floor(Math.random() * list.length)];
  }

  randint(max: number): number {
    return Math.floor(Math.random() * max);
  }

  newGame(level) {
    let side_to_start: number = this.randint(2);
    let where_to_start: number;
    let where_to_end: number;
    if (level) { this.level = level; }
    this.width = Math.round((this.level - 1) / 5) + 4;
    this.height = Math.round((this.level - 1) / 3) + 4;
    if (side_to_start === 0) {
      // Start on top
      where_to_start = this.randint(this.width);
      where_to_end = this.randint(this.width) + (this.height - 1) * this.width;
    } else {
      // Start left
      where_to_start = this.randint(this.height) * this.width;
      where_to_end = ((this.randint(this.height) + 1) * this.width) - 1;
    }

    // Create empty board
    this.cells = [];
    for(let row = 0; row < this.height; row++) {
      for(let col = 0; col < this.width; col++) {
        let idx = row * this.width + col;
        let cell = new Cell();
        cell.id = idx;
        if (idx === where_to_start) {
          cell.type = 1;
          cell.lastvisited = true;
        } else if (idx === where_to_end) {
          cell.type = 2;
        }
        this.cells[idx] = cell;
      }
    }
    // Find a path from start to end
    let path = this.findPath(where_to_start, where_to_end);
    if (typeof(path) === "undefined") {
      // if we did not find a path within 1000 tries,
      // start over.
      console.error("Could not generate path");
      this.newGame(this.level);
      return;
    }
    // Put mines but not on the path
    let minecount = Math.round((this.level - 1) / 1.1) + 3;
    if (this.cells.length - path.length < minecount) {
      console.error("I won't be able to place mines");
      this.newGame(this.level);
      return;
    }

    let steps: number = 1000;
    while(minecount > 0 && steps > 0) {
      let rand_cell = this.choice(this.cells);
      if (
        (path.indexOf(rand_cell.id) === -1) &&
        (rand_cell.id !== where_to_start) &&
        (rand_cell.id !== where_to_end) &&
        (rand_cell.type !== 3)
      ) {
        rand_cell.type = 3;
        minecount -= 1;
      } else {
        steps -= 1;
      }
    }
    if (minecount > 0) {
      console.error("Could not place mines", path, minecount);
      this.newGame(this.level);
      return;
    }
    this.status = 0;
    window.setTimeout(() => {
      this.status = 1;
    }, 1500);
  }

  findPath(start: number, end: number) {
    let tree = {};
    let path: number[] = [];
    let blacklist: number[] = [];
    let steps: number = 1000;
    for(let row = 0; row < this.height; row++) {
      for(let col = 0; col < this.width; col++) {
        let idx = row * this.width + col;
        tree[idx] = [];
        if (row > 0) { tree[idx].push(idx - this.width); }
        if (col > 0) { tree[idx].push(idx - 1); }
        if (row < this.height-1) { tree[idx].push(idx + this.width); }
        if (col < this.width-1) { tree[idx].push(idx + 1); }
      }
    }
    path.push(start);
    while (steps > 0) {
      let last = path[path.length-1];
      let choices = tree[last];
      if (choices.indexOf(end) !== -1) {
        path.push(end);
        return path;
      } else {
        let reduced = [];
        for (let choice of choices) {
          if (path.indexOf(choice) === -1) {
            reduced.push(choice);
          }
        }
        let next = this.choice(reduced);
        if (typeof(next) === "undefined") {
          path = path.slice(0, path.length-1);
        } else {
          path.push(next);
        }
      }

      steps -= 1;
    }
  }

  click(cell: Cell) {
    let index = cell.id;
    if ((this.status === 1) && (cell.type === 1)) {
      this.status = 2;
      this.curpos = index;
      cell.visited = true;
      for(let cel of this.cells) {
        cel.lastvisited = false;
      }
      cell.lastvisited = true;
    } else if (
      (this.status === 2) &&
      ((index === this.curpos + this.width) ||
       (index === this.curpos - this.width) ||
       (index === this.curpos + 1) ||
       (index === this.curpos - 1))
    ) {
      this.curpos = index;
      cell.visited = true;
      for(let cel of this.cells) {
        cel.lastvisited = false;
      }
      cell.lastvisited = true;
      if (cell.type === 2) {
        this.status = 3;
	this.stars += 1;
        window.setTimeout(() => {
	  if (this.stars === 3) {
	    this.stars = 0;
	    this.router.navigate(['game', this.level + 1]);
          } else {
	    this.newGame(this.level);
	  }
        }, 2000);
      } else if (cell.type === 3) {
        this.status = 4;
	this.stars -= 2;
	if (this.stars < 0) {
	  this.stars = 0;
	}
        window.setTimeout(() => {
	  if (this.stars > 0 || this.level < 2) {
            this.newGame(this.level);
          } else {
	    this.stars = 0;
            this.router.navigate(['game', this.level - 1]);
          }
        }, 2500);
      }
    }
  }

}
