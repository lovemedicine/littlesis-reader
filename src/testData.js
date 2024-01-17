// only useful for testing on this page:
// https://theintercept.com/2024/01/13/penn-palestine-writes-liz-magill/
export const interceptExtractionData = {
  entities: [
    {
      id: 0,
      name: "Liz Magill",
      type: "person",
    },
    {
      id: 1,
      name: "Stefanik",
      type: "person",
    },
    {
      id: 2,
      name: "Scott Bok",
      type: "person",
    },
    {
      id: 3,
      name: "Susan Abulhawa",
      type: "person",
    },
    {
      id: 4,
      name: "Jewish Federation of Greater Philadelphia",
      type: "organization",
    },
    {
      id: 5,
      name: "Anti-Defamation League of Philadelphia",
      type: "organization",
    },
    {
      id: 6,
      name: "University of Pennsylvania",
      type: "organization",
    },
    {
      id: 7,
      name: "Penn",
      type: "organization",
    },
    {
      id: 8,
      name: "J. Larry Jameson",
      type: "person",
    },
    {
      id: 9,
      name: "Bill Mullen",
      type: "person",
    },
    {
      id: 10,
      name: "Julie Platt",
      type: "person",
    },
    {
      id: 11,
      name: "Jewish Federations of North America",
      type: "organization",
    },
    {
      id: 12,
      name: "Josh Shapiro",
      type: "person",
    },
    {
      id: 13,
      name: "Art Council",
      type: "organization",
    },
    {
      id: 14,
      name: "Marie Kelly",
      type: "person",
    },
  ],
  relationships: [
    {
      entity1_id: 0,
      entity2_id: 2,
      description: "resigned together",
    },
    {
      entity1_id: 0,
      entity2_id: 6,
      description: "University of Pennsylvania",
    },
    {
      entity1_id: 0,
      entity2_id: 7,
      description: "University of Pennsylvania",
    },
    {
      entity1_id: 0,
      entity2_id: 1,
      description: "Stefanik’s line of questioning",
    },
    {
      entity1_id: 0,
      entity2_id: 9,
      description: "board member of Palestine Writes",
    },
    {
      entity1_id: 0,
      entity2_id: 10,
      description: "vice chair of the university board",
    },
    {
      entity1_id: 4,
      entity2_id: 0,
      description: "sent letters to Magill",
    },
    {
      entity1_id: 5,
      entity2_id: 0,
      description: "sent letters to Magill",
    },
    {
      entity1_id: 6,
      entity2_id: 3,
      description: "citing concerns about certain speakers",
    },
    {
      entity1_id: 6,
      entity2_id: 13,
      description: "represented in court proceedings",
    },
    {
      entity1_id: 6,
      entity2_id: 14,
      description: "board member for Palestine Writes",
    },
    {
      entity1_id: 11,
      entity2_id: 10,
      description: "Platt also serves as board chair",
    },
    {
      entity1_id: 12,
      entity2_id: 13,
      description: "represented the arts council in court proceedings",
    },
  ],
};

// only useful for testing on this page:
// https://www.latimes.com/politics/story/2024-01-07/kamala-harris-doug-emhoff-los-angeles-home-brentwood
export const laTimesEntities = [
  {
    id: 0,
    name: "Air Force Two",
    type: "organization",
    related: ["Kamala Harris"],
  },
  { id: 1, name: "LAX", type: "organization" },
  {
    id: 2,
    name: "Kamala Harris",
    type: "person",
    related: [
      "Doug Emhoff",
      "Joe Biden",
      "The Times",
      "Laphonza Butler",
      "Brian Brokaw",
      "Chrisette Hudlin",
      "Brentwood",
      "Air Force Two",
      "The Naval Observatory",
      "Melanie Apple Fields",
      "King Abdullah II of Jordan",
    ],
  },
  {
    id: 3,
    name: "Doug Emhoff",
    type: "person",
    related: [
      "Kamala Harris",
      "Cole Emhoff",
      "Ella Emhoff",
      "The Times",
      "Chrisette Hudlin",
      "Brentwood",
      "The Naval Observatory",
    ],
  },
  {
    id: 4,
    name: "Cole Emhoff",
    type: "person",
    related: ["Doug Emhoff", "Greenley Littlejohn"],
  },
  {
    id: 5,
    name: "Greenley Littlejohn",
    type: "person",
    related: ["Cole Emhoff"],
  },
  { id: 6, name: "El Cholo", type: "organization" },
  {
    id: 7,
    name: "The Times",
    type: "organization",
    related: ["Doug Emhoff", "Kamala Harris"],
  },
  { id: 8, name: "Joe Biden", type: "person", related: ["Kamala Harris"] },
  {
    id: 9,
    name: "Brentwood",
    type: "organization",
    related: ["Kamala Harris", "Doug Emhoff", "Getty fire"],
  },
  {
    id: 10,
    name: "The Naval Observatory",
    type: "organization",
    related: ["Kamala Harris", "Doug Emhoff"],
  },
  {
    id: 11,
    name: "Laphonza Butler",
    type: "person",
    related: ["Kamala Harris"],
  },
  { id: 12, name: "Ella Emhoff", type: "person", related: ["Doug Emhoff"] },
  { id: 13, name: "Brian Brokaw", type: "person", related: ["Kamala Harris"] },
  {
    id: 14,
    name: "Chrisette Hudlin",
    type: "person",
    related: ["Kamala Harris", "Doug Emhoff"],
  },
  { id: 15, name: "Hollywood Bowl", type: "organization" },
  { id: 16, name: "Cinerama Dome", type: "organization" },
  { id: 17, name: "Huntington Meats", type: "organization" },
  { id: 18, name: "Gearys", type: "organization" },
  { id: 19, name: "Zankou Chicken", type: "organization" },
  { id: 20, name: "Guelaguetza", type: "organization" },
  { id: 21, name: "Toscana", type: "organization" },
  { id: 22, name: "Craig's", type: "organization" },
  { id: 23, name: "Hillcrest", type: "organization" },
  { id: 24, name: "Frida's", type: "organization" },
  { id: 25, name: "Zero 7", type: "organization" },
  { id: 26, name: "Golden State Warriors", type: "organization" },
  { id: 27, name: "Lakers", type: "organization" },
  { id: 28, name: "Getty fire", type: "organization", related: ["Brentwood"] },
  {
    id: 29,
    name: "Melanie Apple Fields",
    type: "person",
    related: ["Voyage et Cie", "Kamala Harris", "Jill Biden"],
  },
  {
    id: 30,
    name: "Voyage et Cie",
    type: "organization",
    related: ["Melanie Apple Fields", "Alex Padilla"],
  },
  { id: 31, name: "Studio City", type: "organization" },
  { id: 32, name: "Alex Padilla", type: "person", related: ["Voyage et Cie"] },
  {
    id: 33,
    name: "King Abdullah II of Jordan",
    type: "person",
    related: ["Kamala Harris"],
  },
  { id: 34, name: "Nina Ricci", type: "organization" },
  { id: 35, name: "Peninsula", type: "organization" },
  {
    id: 36,
    name: "Jill Biden",
    type: "person",
    related: ["Melanie Apple Fields"],
  },
  {
    id: 37,
    name: "Courtney Subramanian",
    type: "person",
    related: ["Los Angeles Times"],
  },
  {
    id: 38,
    name: "Los Angeles Times",
    type: "organization",
    related: ["Courtney Subramanian", "Christina House"],
  },
  {
    id: 39,
    name: "Christina House",
    type: "person",
    related: ["Los Angeles Times"],
  },
  { id: 40, name: "Cal State Fullerton", type: "organization" },
  { id: 41, name: "Robert F. Kennedy Journalism Award", type: "organization" },
];

export const interceptTextContent = `Few U.S. colleges have generated more controversy for their response to Israel’s war on Gaza than the University of Pennsylvania. Penn’s president Liz Magill faced criticism for her answers about hypothetical scenarios of antisemitism posed during a congressional hearing by Rep. Elise Stefanik, R-N.Y., who has herself faced criticism for embracing antisemitic conspiracy theories.
Stefanik’s line of questioning last month was part of a wider campaign in the wake of the October 7 Hamas attack on Israel: demonizing pro-Palestine activism. Stefanik conflated calls for “intifada” — an Arabic word for “uprising” — with antisemitic attacks and asked Magill, along with other university presidents, if these purported calls for the genocide of Jews constituted harassment. Magill, by all accounts, stumbled through a non-answer.
Under pressure from billionaire donors and pro-Israel lobby groups, Magill and Penn board chair Scott Bok resigned four days after the hearing.
News of the resignations was framed as part of the university’s failure to handle antisemitism on campus in the wake of October 7. But the effort to oust Magill began months before the Hamas attack, according to public letters and people familiar with the fight over Israel and Palestine at Penn. As early as August, Magill had drawn the ire of pro-Israel lobbying groups, nonprofits, and university donors after rebuffing their efforts to cancel a literary festival on campus called Palestine Writes.
The story of what happened at Penn was distorted to obscure the earlier round of anti-Palestinian attacks against the literary festival, said Radhika Sainath, a senior staff attorney at Palestine Legal who works on speech and academic freedom. Palestine Legal advised the festival and urged Magill to resist censoring the event.
Sainath, who attended the festival to conduct research for a novel, said that media reports ran with unverified claims that Palestine Writes had stoked antisemitism, even suggesting that the festival was linked to the Hamas attack.
“You could really see how pretty much every newspaper was just adopting the framework of these Israel lobby groups as a given, as if the festival was antisemitic,” she said. “People were just really upset in part about a large number of Palestinians potentially coming to campus to talk about Palestinian literature.”
That coverage amplified the attacks that led to the congressional hearings, eventually precipitating Magill’s resignation. University officials squandered an opportunity to correct false claims that students had called for the genocide of Jewish people, Sainath said: “They kind of went along with it and fell into this trap.”
A banner for the University of Pennsylvania on campus in Philadelphia on Dec. 8, 2023.
Over the summer, wealthy donors, along with local and national Jewish groups, lined up to take issue with the university’s plans to host a festival in September celebrating Palestinian authors.
One of the leaders of the informal network of critics was Marc Rowan, CEO of the investment firm Apollo Global Management. Rowan serves as advisory board chair of the university’s Wharton School, which he attended, and was previously a member of Penn’s board of trustees. He also chairs the board of the UJA-Federation of New York, an influential Jewish group involved in pro-Israel advocacy.
Another major force against the festival was billionaire Republican donor Ronald Lauder, also a Wharton alum, who pushed Magill to cancel Palestine Writes in a meeting in Philadelphia and two subsequent phone calls.
The Jewish Federation of Greater Philadelphia and the Anti-Defamation League of Philadelphia sent two letters to Magill in August complaining of “a high likelihood” that the festival would “promote inflammatory and antisemitic narratives about Israel.” They alleged that some of the speakers, including Marc Lamont Hill; Noura Erakat; Maysoon Zayid; Huwaida Arraf; Roger Waters; and the festival’s executive director, Susan Abulhawa, had a “history of antisemitism,” citing criticisms of Zionism and Israel’s human rights abuses. The groups said the university should issue a statement “questioning the judgment” of the departments working with the festival, which included Penn’s English, near Eastern languages and civilizations, and cinema and media studies departments.
Festival organizers pushed back. In a September 2 letter to Magill and other university leaders, Abulhawa described the complaints as part of “a campaign to discredit and denigrate” the literature festival. “We categorically reject this cynical, sinister, and ahistorical conflation of bigotry with the moral repudiation of a foreign state’s criminality, particularly as most of us are victims of that state,” she wrote. “Every instance of the examples listed in the original letter refers to Zionism, Zionists, or Israel. Situating those individual Palestinians and our allies in league with actual antisemites is wholly irresponsible and dangerous.”
Ten days later, Magill and other university leaders issued a statement distancing Penn from the festival, citing concerns raised about certain speakers “who have a documented and troubling history of engaging in antisemitism by speaking and acting in ways that denigrate Jewish people.” The university condemned antisemitism, the officials wrote, but supported the free exchange of ideas. “This includes the expression of views that are controversial and even those that are incompatible with our institutional values.”
When it became clear that Palestine Writes would go forward as planned, Rowan, Lauder, and other trustees organized an open letter to Magill reiterating concerns about the festival. The letter eventually gained more than 4,000 signatories, including prominent alumni.
The festival began on September 22 and went off mostly without a hitch, despite threats against organizers and at least two high-profile attendees who were kept from attending in person. Gary Younge, a sociology professor at the University of Manchester; Waters of Pink Floyd; and author Viet Thanh Nguyen were scheduled as plenary speakers. Nguyen was the only one of the three who could attend in person. Younge said his visa was inexplicably revoked prior to his trip to the U.S., and Waters said the university prohibited him from stepping on campus; he spoke to the festival online from the Philadelphia Airport. The university countered that Waters was originally set to attend virtually and a last-minute change would have required additional security. Festival organizers disputed the university’s account.
Attendees and festival board members who spoke to The Intercept described Palestine Writes as a multigenerational, multicultural event that welcomed everyone and fostered an important cultural space on campus, particularly for Palestinian students.
But in the weeks following October 7, media outlets and critics linked the festival to the Hamas attack and said it had fomented an unsafe campus environment for Jewish students. In a letter to the university newspaper published October 12, Rowan and other donors called on Magill and Bok to resign and urged alumni to “close the checkbooks” and halt donations. “It took less than two weeks to go from the Palestine Writes Literary Festival on UPenn’s campus to the barbaric slaughter and kidnapping of Israelis,” Rowan wrote.
Appearing on CNBC, Rowan said his appeal to alumni was a “difficult call for a place that I love for the last 40 years.” He insisted the issue wasn’t about free speech, which he supported — it was about university leaders saying they condemned antisemitism but allowing the literature festival to happen.
“There has been a gathering storm around these issues,” Rowan said. “Microaggressions are condemned with extreme moral outrage, and yet violence — particularly violence against Jews, antisemitism — seems to have found a place of tolerance on the campus, protected by free speech.” Magill was “not capable of exercising moral leadership,” he said, “because she feels academic pressure and peer pressure.”
Lauder threatened to cut additional funding in a letter to Magill on October 17, saying that she was forcing him to reexamine his financial support “absent unsatisfactory measures to address antisemitism at the university.” The letter brought him great sorrow, Lauder wrote. “I am so sorry you did not cancel the event.”
That university administrators, media outlets, and politicians accepted that narrative uncritically underscored the hysteria of the moment, said Bill Mullen, a board member of Palestine Writes. “It’s amazing to me that people can get away with this without being fact-checked,” he said. “You just have to say antisemitism and you terrify people into not asking questions.”
“The attack on Palestine Writes was a very targeted attack on Palestinian writers and intellectuals. And since October 7, we have literally seen Israel murdering Palestinian poets and writers and journalists,” Mullen added. “They wanted to silence these voices.”
After Magill and Bok resigned, Julie Platt, vice chair of the university board, was named interim board chair. Platt also serves as board chair of the Jewish Federations of North America. Penn named J. Larry Jameson, the dean of its medical school, as interim president.
Since the resignations, the university has further aligned itself with pro-Israel lobbying groups and donors. Last week, a delegation of faculty took a three-day “solidarity tour” of Israel that included meetings with Israeli government officials and a visit to the Gaza envelope.
Rowan, meanwhile, has sought to guide a transformation at Penn. Days after Magill’s resignation, he sent a letter to trustees raising concerns about the university’s culture and “political orientation,” warning that it had “allowed for preferred versus free speech” and asking how the university considered “viewpoint diversity” in hiring.
An anonymous petition circulated that called on the university to fire three faculty members who had protested in support of Gaza on campus, including festival organizer Huda Fakhreddine, an associate professor of Arabic literature; her husband, a poet and professor of creative writing; and another professor of Persian literature. Fakhreddine, one of several Penn faculty named in the congressional hearing, said that she has since been doxxed and received death threats.
At its annual convention last week in Philadelphia, the Modern Language Association’s Delegate Assembly passed an emergency motion defending speech on Palestine and supporting Fakhreddine and others at Penn facing retaliation for criticizing Israel’s war on Gaza.
University faculty have pushed back against interference by donors and trustees. The executive committee of Penn’s chapter of the American Association of University Professors called on the university to address harassment, intimidation, and threats against faculty and warned of “the chilling effects of statements by trustees, donors, and university administrators on teaching, learning, and scholarship.”
Palestine Writes is now battling a court order that it remove from its website a logo for the Pennsylvania Council on the Arts, which had awarded a grant to the organization. After the dustup over the festival reached the mainstream, the council sent a cease-and-desist letter, which was immediately published by the Anti-Defamation League with unredacted contact information for Abulhawa. In November, a judge on the Philadelphia Court of Common Pleas ordered the logo removed, saying she understood why the council would not want to be affiliated with the festival in the current political climate.
The issue reached the office of Democratic Pennsylvania Gov. Josh Shapiro, who publicly denounced Magill and the university after the congressional hearing. The governor’s office represented the arts council in court proceedings against the festival.
“It was just so eye-opening to me that something as simple as a literature festival could be so threatening to pro-Israel supporters,” said Marie Kelly, a board member for Palestine Writes. The festival was a historic celebration and affirmation of Palestinian culture, Kelly said. “That’s not anything that any pro-Israel academic, millionaire, or politician can take away.”`;

export const interceptEntityNames = [
  "University of Pennsylvania",
  "Liz Magill",
  "Elise Stefanik",
  "Hamas",
  "Scott Bok",
  "Palestine Legal",
  "Marc Rowan",
  "Apollo Global Management",
  "Wharton School",
  "UJA",
  "Federation of New York",
  "Ronald Lauder",
  "Wharton",
  "Palestine Writes",
  "Jewish Federation of Greater Philadelphia",
  "Anti-Defamation League of Philadelphia",
  "Marc Lam",
  "Roger Waters",
  "Susan Abulhawa",
  "Palestine W",
  "Gary Younge",
  "University of Manchester",
  "Pink Floyd",
  "The Intercept",
  "CNBC",
  "Bill Mullen",
  "Julie Platt",
  "Jewish Federations of North America",
  "Modern Language Association",
  "Delegate Assembly",
  "American Association of University Professors",
  "Pennsylvania Council on the Arts",
  "Anti-Defamation League",
  "Philadelphia Court of Common Pleas",
  "Josh Shapiro",
  "Marie Kelly",
];
