//
// Interfaces
//

export interface IceCreamV1 {
  name: string;
  /**
   * value 1,2,3,4,5
   */
  deliciousness: number;
  isCreamy: boolean;
  keywords: string[];
}

export interface IceCreamV2 {
  name: string;
  /**
   * value between 1 - 100
   */
  deliciousness: number;
  /**
   * value between 1 - 100
   */
  creaminess: number;
  keywords: string[];
}

//
// Migrations
//

export function migrate(icecream: IceCreamV1): IceCreamV2 {
  let creaminess = 0;
  if (icecream.keywords.includes("mega creamy")) {
    creaminess = 100;
  } else if (icecream.isCreamy) {
    creaminess = 50;
  } else if (icecream.keywords.includes("creamy")) {
    creaminess = 50;
  }

  const deliciousness = icecream.deliciousness * 20;

  return {
    creaminess,
    deliciousness,
    keywords: icecream.keywords,
    name: icecream.name,
  };
}

export function rollback(icecream: IceCreamV2): IceCreamV1 {
  return {
    name: icecream.name,
    // BUG: isCreamy: icecream.creaminess >= 50,
    isCreamy: icecream.creaminess === 50,
    // BUG: deliciousness: Math.ceil(icecream.deliciousness / 20),
    deliciousness: icecream.deliciousness / 20,
    keywords: icecream.keywords,
  };
}
