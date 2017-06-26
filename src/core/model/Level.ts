export default class Level {
  id: number;
  name: string;
  border: number;

  static 1 = new Level({id:1.0, name: "1", border: 1});
  static 2 = new Level({id:2.0, name: "2", border: 2});
  static 3 = new Level({id:3.0, name: "3", border: 3});
  static 4 = new Level({id:4.0, name: "4", border: 4});
  static 5 = new Level({id:5.0, name: "5", border: 5});
  static 6 = new Level({id:6.0, name: "6", border: 6});
  static 7 = new Level({id:7.0, name: "7", border: 7});
  static 7.5 = new Level({id:7.5, name: "7+", border: 7.7});
  static 8 = new Level({id:8.0, name: "8", border: 8});
  static 8.5  = new Level({id:8.5, name: "8+", border: 8.7});
  static 9 = new Level({id:9.0, name: "9", border: 9});
  static 9.5= new Level({id:9.5, name: "9+", border: 9.7});
  static 10 = new Level({id:10.0, name:"10", border: 10});
  static 10.5 = new Level({id:10.5, name:"10+", border: 10.7});
  static 11 = new Level({id:11.0, name:"11", border: 11});
  static 11.5 = new Level({id:11.5, name:"11+", border: 11.7});
  static 12 = new Level({id:12.0, name:"12", border: 12});
  static 12.5 = new Level({id:12.5, name:"12+", border: 12.7});
  static 13 = new Level({id:13.0, name:"13", border: 13});
  static 13.5 = new Level({id:13.5, name:"13+", border: 13.7});

  static MAX = 13.9;

  constructor(params: any) {
    this.id = params.id;
    this.name = params.name;
    this.border = params.border;
  }

  get number() {
    return this.id;
  }

  static fromNumber(number: number) {
    return Level[number];
  }

  static fromInternalLevel(internalLevel: number) {
    for (let level of Level.All.reverse())
    {
      if (internalLevel >= level.border) return level;
    }
  }

  static get All() {
    return [
            Level[1],
            Level[2],
            Level[3],
            Level[4],
            Level[5],
            Level[6],
            Level[7],
            Level[7.5],
            Level[8],
            Level[8.5],
            Level[9],
            Level[9.5],
            Level[10],
            Level[10.5],
            Level[11],
            Level[11.5],
            Level[12],
            Level[12.5],
            Level[13],
            Level[13.5],
           ];
  }
}