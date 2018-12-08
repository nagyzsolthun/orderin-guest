export default class Category {
    id: string;
    name: string;

    static fromJson(json): Category {
        const result = new Category();
        result.id = json.id;
        result.name = json.name;
        return result;
    }
}