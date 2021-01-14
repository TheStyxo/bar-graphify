const multiplyString = (t: number, s: string) => Array(++t).join(s);

export class Graph {
    // Class props //
    protected readonly xLabels: (string | undefined)[];
    protected readonly yLabels: (string | undefined)[];
    protected readonly fillChar: string;
    protected readonly emptyChar: string;
    protected readonly cursor: string;
    cursorLocation: number;
    barWidth: number;
    protected readonly firstCollumnWidth: number;
    protected readonly firstCollumnSeparator: string;
    fillHeights: (number | undefined)[];
    protected graph?: Array<Array<string>>
    // Class props //

    constructor(options: GraphOptions = {}) {
        const finalOptions = Object.assign({
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
        }, options);

        const maxCollumnHeight = Math.max(...finalOptions.fillHeights);
        if (maxCollumnHeight - finalOptions.xLabels.length > 0) {
            const defaultXlabels = Array(maxCollumnHeight - finalOptions.xLabels.length).fill(null).map((v: any, i: number) => "X" + (i + finalOptions.xLabels.length));
            this.xLabels = [...finalOptions.xLabels, ...defaultXlabels];
        }
        else this.xLabels = finalOptions.xLabels;
        if (finalOptions.fillHeights.length - finalOptions.yLabels.length > 0) {
            const defaultYlabels = Array(finalOptions.fillHeights.length - finalOptions.yLabels.length).fill(null).map((v: any, i: number) => "Y" + (i + finalOptions.yLabels.length));
            this.yLabels = [...finalOptions.yLabels, ...defaultYlabels];
        }
        else this.yLabels = finalOptions.yLabels;
        this.fillChar = finalOptions.fillChar !== "" ? finalOptions.fillChar : " ";
        this.emptyChar = finalOptions.emptyChar !== "" ? finalOptions.emptyChar : " ";
        this.cursor = finalOptions.cursor !== "" ? finalOptions.cursor[0] : "^";
        this.cursorLocation = finalOptions.cursorLocation;
        this.barWidth = finalOptions.barWidth;
        this.firstCollumnWidth = finalOptions.firstCollumnWidth;
        this.firstCollumnSeparator = finalOptions.firstCollumnSeparator !== "" ? finalOptions.firstCollumnSeparator : "|";
        this.fillHeights = finalOptions.fillHeights;
    }

    private makeFirstCollumn() {
        const reversedLabels = [...this.xLabels].reverse();
        const maxLabelLength = Math.max(...reversedLabels.map(l => l!.length));
        const width = maxLabelLength < this.firstCollumnWidth ? this.firstCollumnWidth : maxLabelLength;

        const items: string[] = [];

        for (let i = 0; i < reversedLabels.length; i++) {
            const label = reversedLabels[i] || `X${i}`
            items.push(multiplyString(width - label.length, " ") + `${label}${this.firstCollumnSeparator}`);
        }

        const emptyLine = multiplyString(width + this.firstCollumnSeparator.length, " ");

        items.push(emptyLine);
        if (this.cursorLocation) items.push(emptyLine);
        return items;
    }

    public setBar(index: number, value: number) {
        if (value > Math.max(...this.fillHeights as number[])) throw new RangeError("Value exceeds the initial graph range.");
        if (this.fillHeights[index - 1]) {
            this.fillHeights[index - 1] = value;
            this.updateGraph();
        }
        else throw new RangeError("The index does not exist on graph.");
    }

    private makeCollumn(index: number) {
        const items: string[] = [];

        const maxLabelLength = Math.max(...this.yLabels.map(l => l!.length));
        const height = this.xLabels.length;
        const width = this.barWidth > maxLabelLength ? this.barWidth : maxLabelLength;

        for (let i = 1; i <= height; i++) {
            items.push(i <= height - (this.fillHeights[index] || 0) ? multiplyString(width, this.emptyChar) : multiplyString(width, this.fillChar));
        }
        //Add y label
        const label = this.yLabels[index] || `Y${index}`;
        items.push(this.yLabels[index] + multiplyString(width - label.length, " "));
        //Add cursor or cursor line
        if (this.cursorLocation) items.push(multiplyString(label.length, this.cursorLocation - 1 === index ? this.cursor : " ") + multiplyString(width - label.length, " "));

        return items;
    }

    private updateGraph() {
        this.graph = [];
        const firstCollumnItems = this.makeFirstCollumn();

        for (let i = 0; i < firstCollumnItems.length; i++) {
            if (!this.graph[i]) this.graph[i] = [];
            this.graph[i].push(firstCollumnItems[i]);
        }

        const maxRowLength = Math.max(this.graph.length - 1, this.yLabels.length - 1);

        for (let index = 0; index < maxRowLength; index++) {
            const collumnItems = this.makeCollumn(index);

            for (let i = 0; i < collumnItems.length; i++) {
                if (!this.graph[i]) this.graph[i] = [];
                this.graph[i].push(collumnItems[i]);
            }
        }
    }

    toString() {
        if (!this.graph) this.updateGraph();
        if (!this.graph) return "";
        const rows = [];
        for (let index = 0; index < this.graph.length; index++) {
            rows.push(this.graph[index].join(" "));
        }
        return rows.join("\n");
    }
}

export interface GraphOptions {
    xLabels?: string[],
    yLabels?: string[],
    fillChar?: string,
    emptyChar?: string,
    cursor?: string,
    cursorLocation?: number,
    barWidth?: number,
    firstCollumnWidth?: number,
    firstCollumnSeparator?: string,
    fillHeights?: number[]
}