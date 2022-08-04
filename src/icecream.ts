//
// Interfaces
//

export interface IceCreamV1 {
  name: string;
  isCreamy: boolean;
  keywords: string[];
}

export interface IceCreamV2 {
  name: string;
  creaminess: number;
  keywords: string[];
}

//
// Migrations
//

export function migrate(v1: IceCreamV1): IceCreamV2 {
  const { name, isCreamy, keywords } = v1;

  let creaminess = 0;
  if (keywords.includes("mega creamy")) {
    creaminess = 100;
  } else if (keywords.includes("creamy")) {
    creaminess = 50;
  } else if (isCreamy) {
    creaminess = 50;
  }

  return { name, keywords, creaminess };
}

export function rollback(v2: IceCreamV2): IceCreamV1 {
  const { name, creaminess, keywords } = v2;
  // BUG: isCreamy: icecream.creaminess >= 50,
  const isCreamy = creaminess === 50;
  return { name, isCreamy, keywords };
}
