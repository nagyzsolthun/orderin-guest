export default class Category {
    id: string;
    name: Map<string,string>;

    static fromJson(json): Category {
        const result = new Category();
        result.id = json.id;
        result.name = new Map(Object.entries(json.name));
        return result;
    }
}