import { Component, OnInit, Input } from '@angular/core';
import { Tag } from '../model/tag';
import { GameService } from '../service/game.service';

@Component({
  selector: 'app-tag-list',
  templateUrl: './tag-list.component.html',
  styleUrls: ['./tag-list.component.css']
})
export class TagListComponent implements OnInit {

  @Input() tags: Tag[] = [];
  @Input() game_id: number;

  constructor(private gameService: GameService) { }

  ngOnInit() {
    if (this.game_id) {
      this.gameService.getTagsForGame(this.game_id)
        .subscribe(tags => this.tags = tags);
    }
  }

  tagMap() {
    return this.tags.reduce((acc,cur) => {
      let res = acc || [];
      let obj = res.find(val => val.tag_id === cur.id);
      if (!obj) {
        obj = {tag_id: cur.id, name: cur.name, count: 0, tags: []};
        acc.push(obj);
      }
      obj.tags.push(cur);
      obj.count++;
      return acc;
    },[])
    .sort((a,b)=>b.count-a.count);
  }

}
