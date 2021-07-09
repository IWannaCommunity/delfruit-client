export class Screenshot {
  id: number;
  game_id: number;
  added_by_id: number;
  approved_by_id: number;
  description: string;
  approved: boolean;
  date_created: Date;
  removed: boolean;

  user_name: string;
  game_name: string;

  getUrl(): string {
    return "https://delicious-fruit.sfo3.cdn.digitaloceanspaces.com/"+this.game_id+"_"+this.id.toString(16).padStart(8,'0');
  }
}