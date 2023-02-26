import store from "store-js";

export default class Setting<Type = string> {
    private key: string;
    private defaultValue: Type;
    private inputProcessor: (value: Type) => any;
    private outputProcessor: (value: Type) => any;
    private listener: Array<(value: Type) => void> = new Array();

    constructor(key: string, defaultValue?: Type, inputProcessor?: (value?: Type) => any, outputProcessor?: (value?: any) => Type) {
        this.key = key;
        this.defaultValue = inputProcessor ? inputProcessor(defaultValue) : defaultValue;
        this.inputProcessor = inputProcessor;
        this.outputProcessor = outputProcessor;

        this.value = outputProcessor ? outputProcessor(store.get(key)) : store.get(key);
    }

    get value(): Type {
        let data = store.get(this.key) || this.defaultValue;
        if (this.outputProcessor) data = this.outputProcessor(data);
        try {
            return JSON.parse(data);
        } catch (error) {
            return data;
        }
    }

    set value(value: Type) {
        if (this.inputProcessor) value = this.inputProcessor(value);
        if (typeof value == "object") store.set(this.key, JSON.stringify(value));
        else store.set(this.key, value);
        this.listener.forEach((cb) => cb(this.outputProcessor ? this.outputProcessor(value) : value));
    }

    watch(cb: (vaue: Type) => void) {
        this.listener.push(cb);
    }
}
