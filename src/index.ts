

const genRand = (max: number, min: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const ms = (t: number, s: string) => Array(++t).join(s);

export class Graph {
    // Class props //
    protected readonly xLabels: string[];
    protected readonly yLabels: string[];
    protected readonly fillChar: string;
    protected readonly emptyChar: string;
    protected readonly cursorChar: string;
    protected cursorLocation: number;
    protected readonly collumnWidth: number;
    protected readonly firstCollumnWidth: number;
    protected readonly collumnSeparator: string;
    protected readonly firstCollumnSeparator: string;
    protected readonly fillHeights: number[];
    protected generatedCollumns: Array<Array<string> | undefined> = [];
    //Override the toString() method
    toString(): string {
        if (!this._rendered) this._render();
        return this._rendered!;
    }
    private _rendered?: string;
    // Class props //
    constructor(options: GraphOptions = {}) {
        if (options.xLabels)
            if (!Array.isArray(options.xLabels)) throw new TypeError("graph option 'xLabels' must be an array of strings.");
            else {
                for (const val of options.xLabels) if (typeof val !== "string") throw new TypeError("graph option 'xLabels' must be an array of strings.");
                this.xLabels = options.xLabels;
            }
        else this.xLabels = ["X1", "X2", "X3"]; //Max collumn height will be limited to this length

        if (options.yLabels)
            if (!Array.isArray(options.yLabels)) throw new TypeError("graph option 'yLabels' must be an array of strings.");
            else {
                for (const val of options.yLabels) if (typeof val !== "string") throw new TypeError("graph option 'yLabels' must be an array of strings.");
                this.yLabels = options.yLabels;
            }
        else this.yLabels = ["Y1", "Y2", "Y3"]; //Max number of collumns will be limited to this length

        if (options.fillChar)
            if (typeof options.fillChar !== "string") throw new TypeError("graph option 'fillChar' must be a string.");
            else if (options.fillChar.length !== 1) throw new TypeError("graph option 'fillChar' must be a string containing a single character.");
            else this.fillChar = options.fillChar;
        else this.fillChar = "▄";

        if (options.emptyChar)
            if (typeof options.emptyChar !== "string") throw new TypeError("graph option 'emptyChar' must be a string.");
            else if (options.emptyChar.length !== 1) throw new TypeError("graph option 'emptyChar' must be a string containing a single character.");
            else this.emptyChar = options.emptyChar;
        else this.emptyChar = " ";

        if (options.cursorChar)
            if (typeof options.cursorChar !== "string") throw new TypeError("graph option 'cursorChar' must be a string.");
            else if (options.cursorChar.length !== 1) throw new TypeError("graph option 'cursorChar' must be a string containing a single character.");
            else this.cursorChar = options.cursorChar;
        else this.cursorChar = "^";

        if (options.cursorLocation)
            if (typeof options.cursorLocation !== "number") throw new TypeError("graph option 'cursorLocation' must be a number.");
            else if (options.cursorLocation > this.yLabels.length) throw new TypeError("graph option 'cursorLocation' exceeds max collumns in table.");
            else this.cursorLocation = options.cursorLocation;
        else this.cursorLocation = 0;

        if (options.collumnWidth)
            if (typeof options.collumnWidth !== "number") throw new TypeError("graph option 'collumnWidth' must be a number.");
            else this.collumnWidth = Math.max(options.collumnWidth, Math.max(...this.yLabels.map(l => l.length)));
        else this.collumnWidth = Math.max(...this.yLabels.map(l => l.length));

        if (options.firstCollumnWidth)
            if (typeof options.firstCollumnWidth !== "number") throw new TypeError("graph option 'firstCollumnWidth' must be a number.");
            else this.firstCollumnWidth = Math.min(options.firstCollumnWidth, Math.max(...this.xLabels.map((l) => l.length)));
        else this.firstCollumnWidth = Math.max(...this.xLabels.map((l) => l.length));

        if (options.firstCollumnSeparator)
            if (typeof options.firstCollumnSeparator !== "string") throw new TypeError("graph option 'firstCollumnSeparator' must be a string.");
            else this.firstCollumnSeparator = options.firstCollumnSeparator;
        else this.firstCollumnSeparator = "| ";

        if (options.collumnSeparator)
            if (typeof options.collumnSeparator !== "string") throw new TypeError("graph option 'firstCollumnSeparator' must be a string.");
            else this.collumnSeparator = options.collumnSeparator;
        else this.collumnSeparator = " ";

        if (options.fillHeights)
            if (!Array.isArray(options.fillHeights)) throw new TypeError("graph option 'fillHeights' must be an array of numbers.");
            else {
                for (const val of options.fillHeights) if (typeof val !== "number") throw new TypeError("graph option 'fillHeights' must be an array of numbers.");
                this.fillHeights = Array(this.xLabels.length).fill(null).map((v, i) => options.fillHeights![i] || genRand(this.xLabels.length, 1));
            }
        else this.fillHeights = Array(this.xLabels.length).fill(null).map(v => genRand(this.xLabels.length, 0));
    }

    private _generateFirstCollumn(): void {
        this.generatedCollumns[0] = [];

        for (let i = this.xLabels.length - 1; i >= 0; i--) {
            const label = this.xLabels[i];
            this.generatedCollumns[0].unshift(ms(this.firstCollumnWidth - label.length, " ") + label + this.firstCollumnSeparator);
        }

        //create an empty lime the length of the bar
        const emptyLine = ms(this.firstCollumnWidth + this.firstCollumnSeparator.length, " ");

        //Add empty line at the bottom
        this.generatedCollumns[0].unshift(emptyLine);

        if (this.cursorLocation !== 0) this.generatedCollumns[0].unshift(emptyLine);
    }

    private _generateCollumn(index: number): void {
        if (index === 0) return this._generateFirstCollumn();

        this.generatedCollumns[index] = [];

        for (let i = 0; i < this.xLabels.length; i++) {
            this.generatedCollumns[index]!.push(this.fillHeights[index - 1] - 1 < i ? ms(this.collumnWidth, this.emptyChar) : ms(this.collumnWidth, this.fillChar));
        }
        //Add the label
        let label = this.yLabels[index - 1];
        if (label.length < this.collumnWidth) label += ms(this.collumnWidth - label.length, this.emptyChar);
        this.generatedCollumns[index]!.unshift(label);
        //Add the cursor
        if (this.cursorLocation !== 0) {
            if (this.cursorLocation === index) this.generatedCollumns[index]!.unshift(ms(this.yLabels[index - 1].length, this.cursorChar));
            else this.generatedCollumns[index]!.unshift(ms(this.collumnWidth, this.emptyChar));
        }
    }


    private _generateAll(): void { for (let i = 0; i <= this.yLabels.length; i++) this._generateCollumn(i) };

    private _render(): this {
        if (!this.generatedCollumns || !this.generatedCollumns.length) this._generateAll();

        this._rendered = "";

        //Loop for the entire height through every collumn from top to bottom
        for (let h = this.generatedCollumns[0]!.length - 1; h >= 0; h--) {
            //Loop through each individual collumn at the current height
            for (let c = 0; c < this.generatedCollumns.length; c++)
                this._rendered += c > 1 ? (this.collumnSeparator + this.generatedCollumns[c]![h]) : this.generatedCollumns[c]![h];
            //Add a new line
            if (h !== 0) this._rendered += "\n";
        }
        return this;
    }

    /**
     * Change the location of the cursor or remove the cursor
     * @param {number} newCursorLocation The index of the collumn where the new cursor should be (starts from 1 as 0 is the labels)
     */
    setCursor(newCursorLocation: number) {
        //If the collumns are not generated yet
        if (!this.generatedCollumns || !this.generatedCollumns.length) this._generateAll();

        //If there is no change in cursor location
        if (this.cursorLocation === newCursorLocation) return this;

        //If there was no previous cursor or the cursor is getting removed
        if (this.cursorLocation === 0 || newCursorLocation === 0) {
            this.cursorLocation = newCursorLocation;
            this._generateAll();
            this._render();
            return this;
        }

        //If there is change in cursor location, generate only two collumns again
        const temp = this.cursorLocation;
        this.cursorLocation = newCursorLocation;
        this._generateCollumn(temp);
        this._generateCollumn(this.cursorLocation);
        this._render();
        return this;
    }

    /**
     * Set the collumn height/heights by providing an object {collumn: number, height:number} or an array of that
     * @param {CollumnHeight[]} heights 
     */
    setCollumnHeight(...heights: CollumnHeight[]) {
        //If the collumns are not generated yet
        if (!this.generatedCollumns || !this.generatedCollumns.length) this._generateAll();

        // Hacky support for providing an array
        if (Array.isArray(heights[0])) heights = heights[0] as unknown as CollumnHeight[];

        if (!heights.length || !heights.every((height) => JSON.stringify(Object.keys(height).sort()) === '["collumn","height"]'))
            throw new TypeError("Heights must be a non-empty object array containing 'collumn' and 'height' properties.");

        for (const { collumn, height } of heights) {
            this.fillHeights[collumn - 1] = height;
            this._generateCollumn(collumn);
        }

        this._render();
    }
}

export interface GraphOptions {
    xLabels?: string[],
    yLabels?: string[],
    fillChar?: string,
    emptyChar?: string,
    cursorChar?: string,
    cursorLocation?: number,
    collumnWidth?: number,
    firstCollumnWidth?: number,
    collumnSeparator?: string,
    firstCollumnSeparator?: string,
    fillHeights?: number[]
}

export interface CollumnHeight {
    collumn: number,
    height: number
}