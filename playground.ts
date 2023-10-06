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
