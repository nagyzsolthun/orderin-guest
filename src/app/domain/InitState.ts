import Venue from "./Venue";
import Category from "./Category";

export default class InitState {
    rootCategories: Array<Category>;
    venue: Venue;

    static fromJson(json: any): InitState {
        const result = new InitState();
        result.rootCategories = json.rootCategories.map(Category.fromJson);
        result.venue = Venue.fromJson(json.venue);
        return result;
    }
}