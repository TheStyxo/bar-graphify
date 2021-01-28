# Bar Graphify
### A simple and lightweight node module to create bar graphs as strings.

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
    cursorChar: "^",
    cursorLocation: 1,
    collumnWidth: 3,
    firstCollumnWidth: 4,
    collumnSeparator: " ",
    firstCollumnSeparator: "| ",
    fillHeights: [2, 1, 3]
}
const graph = new Graph(options);

console.log(graph.toString()); 
```
Console:
```
X3|         ▄▄▄
X2| ▄▄▄     ▄▄▄
X1| ▄▄▄ ▄▄▄ ▄▄▄
    Y1  Y2  Y3
    ^^
```
---
## Methods:
> ### `setCursor()`
> #### Example:
> ```js
> graph.setCursor(3);
>
> console.log(graph.toString()); 
> ```
> 
> #### Console:
> ```
> X3|         ▄▄▄
> X2| ▄▄▄     ▄▄▄
> X1| ▄▄▄ ▄▄▄ ▄▄▄
>     Y1  Y2  Y3
>             ^^
> ```
> #
> ### `setCollumnHeight()`
> #### Example:
> ```js
> graph.setCollumnHeight({ collumn: 2, height: 2 });
>
> console.log(graph.toString()); 
> ```
> 
> #### Console:
> ```
> X3|         ▄▄▄
> X2| ▄▄▄ ▄▄▄ ▄▄▄
> X1| ▄▄▄ ▄▄▄ ▄▄▄
>     Y1  Y2  Y3
>             ^^
> ```
> #

## Contributors
👤 **TheStyxo**

- Contributor
- Github: [@TheStyxo](https://github.com/TheStyxo)