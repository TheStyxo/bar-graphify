# Bar Graphify
### A simple and lightweight node module to create bar graphs.

<br>

# Installation
**NPM** :

```bash
npm install bar-graphify
```
---
## Example usage:
```js
const Graph = require('bar-graphify');
const options = {
    xLabels: ["X1", "X2", "X3"],
    yLabels: ["Y1", "Y2", "Y3"],
    fillChar: "▄",
    emptyChar: " ",
    cursor: "^",
    cursorLocation: 0,
    barWidth: 1,
    firstCollumnWidth: 5,
    firstCollumnSeparator: "",
    fillHeights: [2, 1, 3]
}
const graph = new Graph(options);

console.log(graph.toString()); 
```
Output:
```
X3|       ▄▄
X2| ▄▄    ▄▄
X1| ▄▄ ▄▄ ▄▄
    Y1 Y2 Y3
```

## Contributors
👤 **TheStyxo**

- Contributor
- Github: [@TheStyxo](https://github.com/TheStyxo)