// First update the list with the new event id
const updateListEvent = {
  created_at: 1696597254,
  content: "",
  tags: [
    ["name", "To read"],
    ["description", "Here is a list of content I want to read"],
    ["d", "z0zppi4wiz5kdn3a"],
    ["e", "a531f624e85b7c911df54ab822ad94619177db16604091551e85980ed00c027c"],
    ["e", "3bfa778939b08ff0a4a5306ee7d4aeecc798a768d551ebc1a859791060d9b5d0"],
  ],
  kind: 30001,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "8793085e1ba59709ec25a7a79f96e4685ade30703248a9692cb29464e5b69fa4",
  sig: "6e45e734a21226ad5181e34466d892a6ec93ca9e19a2c338d79a58b89110d8da842dd7b7839b702da041f5bf9e7d53013216488d0bd7d315eae8e69e2219f651",
};

// Next, publish the data as a
const second = {
  created_at: 1696597302,
  content:
    "AVxAk7pCtAwcllQxQom3J3S/A1R+wVkXXglkt9uglXK1rPhrPv8qgd6NySQP6L+0jgPTGBWyRutawalU/xV2pYxIn0gb6Eii33FkaJ1TvDH37T9zukDnVdTo4JrIdhDhBOPCHmh6aJ/KbMx/JolVc1hx1b/h2z3yvEFI7kmaQ12Xfnpc7KqWGXlWJsOBcvvgYC4aTE7QxizYSeo2sOOoN9+amTmIy24CCyTIT4mK5ikSJQqfuk9xdm7O3Qsfpq1Z5L3tqZ7cMM/N/CN8c8wXcQ==?iv=QOYsUzacm3D93GbUMATDWA==",
  tags: [
    ["p", "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58"],
    ["client", "atlas"],
    ["e", "5a2a71a6537323be9df431b52b74b1077f3ebfa2e05509cd86860cb333d335f1"],
  ],
  kind: 2600,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "ee7f94c4e1dc5b3dcc55f26c6ce6364ebcc78264184f2589e98ea307b20ce850",
};

const eventJson = {
  created_at: 1696597254,
  content: "Another list item",
  tags: [["client", "highlighter"]],
  kind: 1,
  pubkey: "268393bb88f28f67082f366d2df275c9a6caf33202e290599d2d638d89c3f513",
  id: "3bfa778939b08ff0a4a5306ee7d4aeecc798a768d551ebc1a859791060d9b5d0",
  sig: "275467152c74e1cb98add84d853c3245b7f6b1780f329faec9a1a070c7a3f27213221d723eb558ebeb3961bcd070d41923b657544458e58791c5f09fcc045acf",
};

const test = {
  content:
    " https://image.nostr.build/f7e7a2f996b7129b859e89c4e64d1dc11b94cc9e7dd634ef68ac1fcbf74c5b63.jpg ",
  created_at: 1696776554,
  id: "c5ec2885c88d3db5cc5a67f61cda1d8b0f45e167157954838bda82d9eeea0915",
  kind: 1,
  pubkey: "6a02b7d5d5c1ceec3d0ad28dd71c4cfeebb6397b95fef5cd5032c9223a13d02a",
  sig: "0026c7adc156c6d8171d987e6bc1a8986d741b78c392974482c2fe0c878c9427c337fbd6b7bd2a8c04023c61d7c4d0c42f7d3d827f79c51ed04502b1a3953e78",
  tags: [
    ["e", "34361099c7cda48b44174a920df2455d6dfe8634d87067e535d2af33c0393c9f"],
    ["p", "adfe27560472d5168c79e82071f12f7b6039cd94ba664e54a855c37c80f1d737"],
    [
      "imeta",
      "url https://image.nostr.build/f7e7a2f996b7129b859e89c4e64d1dc11b94cc9e7dd634ef68ac1fcbf74c5b63.jpg",
      "blurhash e6S~x6.6IC%LRjx?ICtLM|a#4VtMD*ocafoeRkk7RkRj9FRjbEWBM{",
      "dim 750x1334",
    ],
    [
      "r",
      "https://image.nostr.build/f7e7a2f996b7129b859e89c4e64d1dc11b94cc9e7dd634ef68ac1fcbf74c5b63.jpg",
    ],
  ],
};

const createGenericList = {
  created_at: 1696862051,
  content: "",
  tags: [
    ["name", "Generic list"],
    ["description", "Creating a generic list description"],
    ["d", "yo76jve131e6o750"],
  ],
  kind: 30001,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "eb38a6dd5f04c0559d3b1ba3cb16dd852049f762bd0554bf72e5df7d094da6a1",
};

const listrCreateList = {
  created_at: 1696882406,
  content: "",
  tags: [
    ["title", "Bookmark list"],
    ["description", "List of bookmarks"],
    ["d", "listr-3a56600b-e60e-442c-8190-56f0efdce99f"],
    ["L", "lol.listr.ontology"],
    ["l", "Books & Literature"],
  ],
  kind: 30001,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "93741233108e699874c2dc0828326d5e701fe5a6e4384e1b1658b11c6fcf80f8",
};

const anonListElement = {
  created_at: 1696865950,
  content: "",
  tags: [
    ["name", "New generic list"],
    ["description", "generic list"],
    ["d", "jg0qrmz4q0wpdj56"],
    ["e", "86a20d0a9b3d2b70998d70a4efd43cc15a9ed22ad1c5df1c25d99eaee5ec7bc9"],
  ],
  kind: 30001,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "581355f9e730fb2d6d69c9b19084adc0510d34057ec77bb7c3dccb2f0b80eb56",
  sig: "e28341e43131abb981d267b3df32374b79cf1a9f9522ef26f4a2ed86803841d0baa6fc9881a425863350846e5abbd143c10a6839a408a06acecd5e404901c4f0",
};
const anonListSecond = {
  created_at: 1696866015,
  content:
    "BESw6swGHIil4zbGjFb/fNHGa1/pUDle+f4SV5emJJm/0F+7hFnvLslQgF5m/p2Aema/Ws3j0hCUHbQOrqo7Q3jJp2P+83XQZNs84rMqF4PAu4+4MAX2A0WM/cO6ioRlocHQily/KvbjpS2MaHjKzGWJeWF+PDoMhvmNno5bDzaZxyY8dt2cwlxfYudACH/9mTxpl1ucOZBVQNZe0ep1PzukBmarodqcma/XC745lp47N4jjYy9YjI/jrESVONsXpuC6ianPUVf5TmtELd8O2w==?iv=6f3a+8R53VAnX2YbPvMZfA==",
  tags: [
    ["p", "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58"],
    ["client", "atlas"],
    ["e", "ba60ecc097bc75d7f934f484e9f4d34d6b5b928b441a86bb88e3369e8b269c02"],
  ],
  kind: 2600,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "5167d7d9ebd7e221b53d2434785b0cbb1a18a82163ae461ca1fd5f4a78e4cbc5",
};

const resultJson = {
  created_at: 1696865950,
  content: "Anon list element",
  tags: [["client", "highlighter"]],
  kind: 1,
  pubkey: "c7f4581848eb29f5e212acbbcc952f9b9505bfb86f82c41716e250b4a36fa0cb",
  id: "86a20d0a9b3d2b70998d70a4efd43cc15a9ed22ad1c5df1c25d99eaee5ec7bc9",
  sig: "b557bfc40e07181e0e8f96c6f2d7adfa4f0e41d961654c1a0b1dff6c66d2bbea27bc64174754a53f07873db64bd2a41e4e649c06be5e77adccecabd31decf127",
};

const privateNote = {
  created_at: 1697082331,
  content:
    "VcGm3avXzPgTU1YJMhs4IcC1ety4OjiNIuI79ckZA24=?iv=atLaMX8fl0Y3PkyD6BS05g==",
  tags: [
    ["title", "hEpvEc7mSb1cFr8y/FMKcg==?iv=XPCxZNvIo3mgdOy0ucM/nQ=="],
    ["d", "qmhqy9bzhirbqavh"],
  ],
  kind: 31023,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "715915a933af0950c7240fd7494dbed89b6f5841e1362c9da49d999ff46d9c4a",
};

const privateNoteOnList = {
  created_at: 1697082694,
  content:
    "Rt9dd49nsFSgpzfeUAcD407sT1Zp1Dpq2qgIRSWk+go=?iv=acFP0qtYkuLJfjxDz/jTeg==",
  tags: [
    ["client", "highlighter"],
    ["p", "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58"],
  ],
  kind: 4,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "75ff929010dbb0cc48b850dd6c588b1e9d6615cc1938248865308e3d7bd3edbd",
};

const updatedList = {
  created_at: 1697082703,
  content:
    "eA5hdxvjnJ4r+ifDgSefTltAzPgsGjtIKBalqbj2z3MeINfMUraLKD7DvPb8wYMlG8KbutgoWoIEt8NsRXChZLOFYxCYTb4yDFnCl5c8gxQ=?iv=hi+Fsz/nEfAUH4HtaWMKog==",
  tags: [
    ["name", "Ordstr Ideas"],
    ["title", "Ordstr Ideas 🤔"],
    ["d", "bfcc675b"],
    ["description", "List of ideas for ordstr. Feel free to take a look!"],
    ["e", "943294498932f0812e1e00ceee47f9e0cb1b50c2d33a65b47bc24a8c1c92f82d"],
    ["e", "bb659f2cc79b5b1a546ab8018613fabcbc693e03e4983628c92d866e3cf62497"],
    ["e", "581201d28836da40189f2563894234f919e3ae3cb1b72c94e4402ebe1d85ec18"],
    ["picture", ""],
  ],
  kind: 30001,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "ae93f01217c9a5ca2bb3ce07f22f815d8a91092ca7ab9cc8d1c7e90768d76737",
  sig: "d2615a9990fced499cb01449ee4a139a4a1ca4fc6bc7ab57f16e12c37bd3aec117d0e5ac25d4510682eccf9579c9fcdcb561085c507018dbed8a65211a0a1611",
};

const highlightComment = {
  created_at: 1697084447,
  content: "Cool",
  tags: [
    [
      "e",
      "84a167d45c086dc9c368621502b35fcf68cd0957be0dadf632e254547c51e729",
      "reply",
    ],
  ],
  kind: 1,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "bc4223236f10017122f22ba4898305d9e4982b8d2341e30b58482067981d835b",
};
const addToShelf = {
  created_at: 1697084700,
  content: "",
  tags: [
    ["name", "Test shelf"],
    ["description", "Here is my test shelf"],
    [
      "a",
      "30023:a012dc823bcf80d5eadf4b6683035634bc40f1b0a52b958278b6bbc96458a70d:m4aufDd4Cf2pp7gjUiAyE",
    ],
    ["d", "7fm18dogmy1zanx1"],
  ],
  kind: 39802,
  pubkey: "17717ad4d20e2a425cda0a2195624a0a4a73c4f6975f16b1593fc87fa46f2d58",
  id: "7e1f2cfda0dcfc7322f42278f6590ca7f32fac070ed5cac6cd105faa53f493ac",
};

const highlight = {
  created_at: 1691526821,
  content:
    "nostr:note1e6qu694vq8xnlwwmdpcvcr6j46ym88m9934lf83ashgmhshl5xss5ducta\nHow come capital will not be required if Bitcoin miners will be paid on the sidechain and will have to forego fees on the mainchain? It's the same.",
  tags: [
    [
      "q",
      "ce81cd16ac01cd3fb9db6870cc0f52ae89b39f652c6bf49e3d85d1bbc2ffa1a1",
      "quote",
    ],
    ["k", "9802"],
    ["e", "ce81cd16ac01cd3fb9db6870cc0f52ae89b39f652c6bf49e3d85d1bbc2ffa1a1"],
  ],
  kind: 1,
  pubkey: "3bf0c63fcb93463407af97a5e5ee64fa883d107ef9e558472c4eb9aaaefa459d",
  id: "2ea60a8b8f1a4978386f49a4bc859d0723e545c956faf2baf97a7dc3d0a788e6",
  sig: "27d78341667b850454aa9b5647388b700dadb5b7fa43ac32e4f166b52c2964d2d74ad6e2035a8bfa4ca2a3b7845f30184673086f37106a58309615f9583e9061",
};
const kind9802 = {
  created_at: 1697057228,
  content:
    "As part of a first PoC, Project Atlas is focusing on bitcoin flows between crypto exchanges across geographical locations.3",
  tags: [
    ["r", "https://highlighter.com/global/newest"],
    ["t", "BIS"],
    ["t", "chainalysis"],
  ],
  kind: 9802,
  pubkey: "fa984bd7dbb282f07e16e7ae87b26a2a7b9b90b7246a44771f0cf5ae58018f52",
  id: "d1a21844fc21143331be59ab7a86d28ba8dfae74bf0eeada6f63c44e87be906c",
  sig: "3b19b4bd5082ebb683170d6d95495163e3b69d657858603dbc66aa9ae1802c533e3bc3bc0159200d077217e97d2ed9e7822762e7ac6eb51234dfc70852c76f62",
};
