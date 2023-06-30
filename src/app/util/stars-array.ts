export class StartsArrayGenerator {

  private stars: number;

  constructor(stars: number = 0) {
    this.stars = stars;
  }

  getStarsValue(punctuation: number = 0): boolean[] {
    let stars: boolean[] = [];
    for (let i = 1; i <= this.stars; i++) {
      if (i <= punctuation) {
        stars.push(true);
      } else {
        stars.push(false);
      }
    }
    return stars;
  }
  
}