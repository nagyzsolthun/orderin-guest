export default class Product {
    id: string;
    name: Map<string,string>;

    static fromJson(json: any): Product {
        const result = new Product();
        result.id = json.id;
        result.name = new Map(Object.entries(json.name));
        return result;
    }

    static fromJsonArr(jsonArr: Array<any>) {
        return jsonArr.map(json => this.fromJson(json));
    }
}