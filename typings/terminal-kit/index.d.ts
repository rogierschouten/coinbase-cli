import { EventEmitter } from "events";

// Type definitions for terminal-kit 1.14
// Project: https://github.com/cronvel/terminal-kit
// Definitions by: Rogier Schouten <https://github.com/rogierschouten>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export type ChainableStyleFunc = ((a?: string | boolean) => Terminal) & Terminal;

export type AutoCompleteResult = string | (string[] & { prefix?: string, postfix?: string });

export type AutoCompleter =
    ((inputString: string) => AutoCompleteResult) |
    ((inputString: string, callback: (s: AutoCompleteResult) => void) => void)

export interface SingleLineMenuOpts {
    /**
     * the line where the menu will be displayed, default to the next line
     */
    y?: number;

    /**
     * (default: ' ') the string separating each menu item
     */
    separator?: string;

    /**
     * (default: ' » ') string indicator for a next page
     */
    nextPageHint?: string;

    /**
     * (default: ' « ') string indicator for a previous page
     */
    previousPageHint?: string;

    /**
     * the style of unselected items, default to the current term
     */
    style?: ChainableStyleFunc;

    /**
     * the style of the selected item, default to term.dim.blue.bgGreen
     */
    selectedStyle?: ChainableStyleFunc;

    /**
     * overide default key bindings, object's keys are Terminal-kit key names, the value is the action (string)
     */
    keyBindings?: {[index: string]: string};

    /**
     * if an unexpected key is pressed, it exits, calling the callback with undefined values
     */
    exitOnUnexpectedKey?: boolean;
}

export interface SingleColumnMenuOpts {
    /**
     * the line where the menu will be displayed, default to the next line
     */
    y?: number;

    /**
     * the style of unselected items, default to the current term
     */
    style?: ChainableStyleFunc;

    /**
     * the style of the selected item, default to term.dim.blue.bgGreen
     */
    selectedStyle?: ChainableStyleFunc;

    /**
     * the style of the submitted item, default to term.bgGray.bold
     */
    submittedStyle?: ChainableStyleFunc;

    /**
     * the text to put before a menu item, default to ' '
     */
    leftPadding?: string;

    /**
     * the text to put before a selected menu item, default to ' '
     */
    selectedLeftPadding?: string;

    /**
     * the text to put before a submitted menu item, default to ' '
     */
    submittedLeftPadding?: string;

    /**
     * (default: 1) the number of lines to create (if needed) between the end of the menu and the bottom of the terminal
     */
    extraLines?: number;

    /**
     * if true (default: false), big items do not span multiple lines, instead they are truncated and ended with an ellipsis char
     */
    oneLineItem?: boolean;

    /**
     * the max width for an item, default to the terminal width
     */
    itemMaxWidth?: number;

    /**
     * if true, the submit action does not end the menu, the callback argument is ignored. The 'submit' event should be listened instead.
     */
    continueOnSubmit?: boolean;

    /**
     * selected index at initialization (default: 0)
     */
    selectedIndex?: number;

    /**
     * overide default key bindings, object's keys are Terminal-kit key names, the value is the action (string)
     */
    keyBindings?: {[index: string]: string};

    /**
     * if an unexpected key is pressed, it exits, calling the callback with undefined values
     */
    exitOnUnexpectedKey?: boolean;
}

export interface SingleColumnMenuResponse {
    /**
     * the user-selected menu item index
     */
    selectedIndex?: number;
    /**
     * the user-selected menu item text
     */
    selectedText?: string;
    /**
     * if true, the selectedIndex was submitted (rarely false, except when stopped)
     */
    submitted: boolean;
    /**
     * the x coordinate of the selected menu item (the first character)
     */
    x: number;
    /**
     * the y coordinate of the selected menu item
     */
    y: number;
    /**
     * when 'exitOnUnexpectedKey' option is set and an unexpected key is pressed, this contains the key that produced the exit
     */
    unexpectedKey?: string;
}

export interface InputFieldOpts {
    /**
     * if true (the default), input are displayed on the terminal
     */
    echo?: boolean;

    /**
     * if set, all characters are replaced by this one (useful for password fields), if true, it is replaced by a dot: •
     */
    echoChar?: string | true;

    /**
     * default input/placeholder
     */
    default?: string;

    /**
     *  (default: -1, end of input) set the cursor position/offset in the input, negative value starts from the end
     */
    cursorPosition?: number;

    /**
     *  if true (default: false), it is cancelable by user using the cancel key (default: ESC), thus will return undefined.
     */
    cancelable?: boolean;

    /**
     * style used, default to the terminal instance (no style)
     */
    style?: ChainableStyleFunc;

    /**
     * style used for hint (auto-completion preview), default to terminal.brightBlack (gray)
     */
    hintStyle?: ChainableStyleFunc;

    /**
     * maximum length of the input
     */
    maxLength?: number;

    /**
     * minimum length of the input
     */
    minLength?: number;

    /**
     * (optional) an history array, so UP and DOWN keys move up and down in the history
     */
    history?: string[];

    /**
     * (optional) an array of possible completion, so the TAB key will auto-complete the input field. If it is a function, it should accept
     * an input string and return the completed string (if no completion can be done, it should return the input string, if multiple
     * candidate are possible, it should return an array of string), if the function accepts 2 arguments (checked using function.length),
     * then the auto-completer will be asynchronous! Also note that if it is an array or the result of the function is an array,
     * and if that array has a special property prefix (a string), then this prefix will be prepended to the output of the auto complete
     * menu, and if it has the special property postfix (still a string), this will be appended to the output of the auto complete menu.
     */
    autoComplete?: string[] | AutoCompleter;

    /**
     * used in conjunction with the 'autoComplete' options, if truthy any auto-complete attempt having many completion candidates will d
     * isplay a menu to let the user choose between each possibilities. If an object is given, it should contain options for the
     * .singleLineMenu() that is used for the completion (notice: some options are overwritten: 'y' and 'exitOnUnexpectedKey')
     */
    autoCompleteMenu?: boolean | SingleLineMenuOpts;

    /**
     * if true (default: false) use the hintStyle to write the auto-completion preview at the right of the input
     */
    autoCompleteHint?: boolean;

    /**
     * overide default key bindings, object's keys are Terminal-kit key names, the value is the action (string).
     */
    keyBindings?: {[index: string]: string};

}

export interface InputFieldHelper extends EventEmitter {
    on(event: "ready"): this;
    on(event: "rebased"): this;

    /**
     * abort the input process and do not even call the inputField()'s callback
     */
    abort(): void;

    /**
     * stop the input process now, call the inputField()'s callback (same behavior than a regular 'ENTER' key pressed)
     */
    stop(): void;

    /**
     * get the current input string
     */
    getInput(): string;
}

export interface SlowTypingOpts {
    /**
     * the style of text, default to term.green
     */
    style?: ChainableStyleFunc;

    /**
     * if a function is given, then this is the style of the text for the flash effect, if falsy then the flash effect is turn off,
     * default to term.bold.brightGreen
     */
    flashStyle?: ChainableStyleFunc | false | undefined | null;

    /**
     * average delay before printing the next char, default to 150 ms
     */
    delay?: number;

    /**
     * ixed delay before the flashStyle of the last printed char is replaced by the regular style, default to 100 ms
     */
    flashDelay?: number;
}

export interface Terminal {

    //////////////////////////////////////////////////////////////////////////////
    // Foreground colors
    //////////////////////////////////////////////////////////////////////////////

    defaultColor: ChainableStyleFunc;
    black: ChainableStyleFunc;
    red: ChainableStyleFunc;
    green: ChainableStyleFunc;
    yellow: ChainableStyleFunc;
    blue: ChainableStyleFunc;
    magenta: ChainableStyleFunc;
    cyan: ChainableStyleFunc;
    white: ChainableStyleFunc;
    brightBlack: ChainableStyleFunc;
    gray: ChainableStyleFunc;
    brightRed: ChainableStyleFunc;
    brightGreen: ChainableStyleFunc;
    brightYellow: ChainableStyleFunc;
    brightBlue: ChainableStyleFunc;
    brightMagenta: ChainableStyleFunc;
    brightCyan: ChainableStyleFunc;
    brightWhite: ChainableStyleFunc;

    //////////////////////////////////////////////////////////////////////////////
    // Background colors
    //////////////////////////////////////////////////////////////////////////////

    bgDefaultColor: ChainableStyleFunc;
    bgBlack: ChainableStyleFunc;
    bgRed: ChainableStyleFunc;
    bgGreen: ChainableStyleFunc;
    bgYellow: ChainableStyleFunc;
    bgBlue: ChainableStyleFunc;
    bgMagenta: ChainableStyleFunc;
    bgCyan: ChainableStyleFunc;
    bgWhite: ChainableStyleFunc;
    bgBrightBlack: ChainableStyleFunc;
    bgGray: ChainableStyleFunc;
    bgBrightRed: ChainableStyleFunc;
    bgBrightGreen: ChainableStyleFunc;
    bgBrightYellow: ChainableStyleFunc;
    bgBrightBlue: ChainableStyleFunc;
    bgBrightMagenta: ChainableStyleFunc;
    bgBrightCyan: ChainableStyleFunc;
    bgBrightWhite: ChainableStyleFunc;

    //////////////////////////////////////////////////////////////////////////////
    // Styles
    //////////////////////////////////////////////////////////////////////////////

    styleReset: Terminal;
    bold: ChainableStyleFunc;
    dim: ChainableStyleFunc;
    italic: ChainableStyleFunc;
    underline: ChainableStyleFunc;
    blink: ChainableStyleFunc;
    inverse: ChainableStyleFunc;
    hidden: ChainableStyleFunc;
    strike: ChainableStyleFunc;

    //////////////////////////////////////////////////////////////////////////////
    // Moving the Cursor
    //////////////////////////////////////////////////////////////////////////////
    saveCursor(): void;
    restoreCursor(): void;
    up(n: number): void;
    down(n: number): void;
    left(n: number): void;
    right(n: number): void;
    nextLine(n: number): void;
    previousLine(n: number): void;
    column(x: number): void;
    scrollUp(n: number): void;
    scrollDown(n: number): void;
    moveTo(x: number, y: number): void;
    move(x: number, y: number): void;
    hideCursor(): void;
    tabSet(): void;
    tabClear(): void;
    tabClearAll(): void;
    forwardTab(n: number): void;
    backwardTab(n: number): void;

    //////////////////////////////////////////////////////////////////////////////
    // Editing the Screen
    //////////////////////////////////////////////////////////////////////////////

    /**
     * erase current line after the cursor
     */
    eraseLineAfter(): Terminal;

    /**
     * erase current line before the cursor
     */
    eraseLineBefore(): Terminal;

    /**
     * erase current line
     */
    eraseLine(): Terminal;

    //////////////////////////////////////////////////////////////////////////////
    // Misc
    //////////////////////////////////////////////////////////////////////////////

    /**
     * full reset of the terminal
     */
    reset(): Terminal;

    //////////////////////////////////////////////////////////////////////////////
    // Terminal's High-level and Advanced Methods
    //////////////////////////////////////////////////////////////////////////////

    /**
     * Wait for user input, call the completion callback when the user hit the ENTER key and pass the user input to the callback.
     * It turns input grabbing on if necessary.
     * It returns an EventEmitter object featuring some functions to control things during the input process
     */
    inputField(options: InputFieldOpts, cb: (error: Error, input: string) => void): InputFieldHelper;

    /**
     * It creates an interactive menu over multiple lines.
     * f the 'exitOnUnexpectedKey' option is set, any other keys will exit the menu, the callback's response argument does not contain any property except 'unexpectedKey', that will contain the key having triggered the exit.
     */
    singleColumnMenu(menuItems: string[], opts: SingleColumnMenuOpts, callback: (error: Error, response: SingleColumnMenuResponse) => void): void;

    /**
     * It outputs some text with an old-fashioned slow-typing effect.
     */
    slowTyping(str: string, opts: SlowTypingOpts, callback: () => void): void;
}

export const terminal: Terminal;
