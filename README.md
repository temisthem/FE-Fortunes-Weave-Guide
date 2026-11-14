# Fire Emblem: Fortune's Weave Companion Guide

A quick-reference companion for *Fire Emblem: Fortune's Weave*, styled after the
[Volcano Princess Hangout Guide](https://github.com/temisthem/VolcanoPrincessHangOut).

## Sections

- **Gifting**
  - *By Character*: pick a unit to see their Loved / Really Liked gifts, likes, interests and
    recruitment requirements (Renown Lv, Support Lv, other conditions) on every route.
  - *By Gift*: pick a gift (search or filter by category) to see every unit that loves or really likes it,
    with their Renown / Support requirement on the selected route.
  - Route selector (Cai / Dietrich / Theodora / Leda) and sorting by Name, Renown Lv or Support Lv.
- **Pale Raven**: pick a unit to see every Bird Time remark and the correct reaction.

## Development

```bash
npm install
npm run dev
npm run build
```

## Data

Data lives in `src/data/*.json`. Portraits are in `public/portraits/`.

| File | Source |
| --- | --- |
| `characters.json` (recruitment) | [Fire Emblem Wiki, list of characters](https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave) |
| `characters.json` (gifts, likes, interests) | [Game8 gift guide](https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690) |
| `gifts.json` (where to buy) | [Game8 list of all gifts](https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/621535). Categories are grouped by item name. |
| `raven.json` | Merged from [RaiderKing](https://raiderking.com/fire-emblem-fortunes-weave-feed-pale-raven-all-characters-perfect-bird-time/), [KeenGamer](https://www.keengamer.com/articles/guides/fire-emblem-fortunes-weave-perfect-bird-time-answers-for-every-character/) and [Game Rant](https://gamerant.com/fire-emblem-fortunes-weave-feed-the-pale-raven-correct-answers/). When the sources disagree, the answer has an `alt` field. |
