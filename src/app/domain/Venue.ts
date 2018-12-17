export default class Venue {
    name: string;
    id: string;

    static fromJson(json: any): Venue {
        const result = new Venue();
        result.name = json.name;
        result.id = json.id;
        return result;
    }
}