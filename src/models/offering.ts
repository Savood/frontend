
export interface Offering{
  id: string,
  header:string,
  description:string,
  creator:string,
  // People who are interested in getting the food
  savoods?:string[]
  likes?:string[]
  comments?: string[],

  date?: string,

  // Cummulative sums,
  cum_likes?: number,
  cum_comments?: number,
  cum_savoods?: number
}
