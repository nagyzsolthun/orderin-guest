export default class Product {
    id: string;
    name: string;

    static fromJson(json: any): Product {
        const result = new Product();
        result.id = json.id;
        result.name = json.name;
        return result;
    }

    static fromJsonArr(jsonArr: Array<any>) {
        return jsonArr.map(json => this.fromJson(json));
    }
}