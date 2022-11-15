import store from "store-js";

export class Setting {
    private key: string;
    private defaultValue: any;
    
    constructor(key: string, defaultValue?: any) {
        this.key = key;
        this.defaultValue = defaultValue;
    }

    get value() {
        return store.get(this.key) || this.defaultValue;
    }

    set value(value) {
        store.set(this.key, value);
    }
}