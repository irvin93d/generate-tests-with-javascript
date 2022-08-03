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

export function migrate({ name, isCreamy, keywords }: IceCreamV1): IceCreamV2 {
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

export function rollback({
  name,
  creaminess,
  keywords,
}: IceCreamV2): IceCreamV1 {
  // BUG: isCreamy: icecream.creaminess >= 50,
  const isCreamy = creaminess === 50;
  return { name, isCreamy, keywords };
}
