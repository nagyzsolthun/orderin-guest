export default class Item {
    portion: string;
    name: Map<string,string>;
    price: Map<string,number>;

    static fromJson(json: any): Item {
        const result = new Item();
        result.portion = json.portion;
        result.name = new Map(Object.entries(json.name));
        result.price = new Map(Object.entries(json.price));
        return result;
    }

    static fromJsonArr(jsonArr: Array<any>) {
        return jsonArr.map(json => this.fromJson(json));
    }
}