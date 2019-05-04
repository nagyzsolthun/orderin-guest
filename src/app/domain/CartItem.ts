import Product from "./Product";
import ProductItem from "./ProductItem";

export default class CartItem {
    productId: string;
    portionId: string;
    productName: Map<string,string>;
    portionName: Map<string,string>;
    price: Map<string,number>;
    count: number;

    static fromObjects(product: Product, productItem: ProductItem): CartItem {
        const result = new CartItem();
        result.productId = product.id;
        result.portionId = productItem.portion;
        result.productName = product.name
        result.portionName = productItem.name;
        result.price = productItem.price;
        result.count = 0;
        return result;
    }

    static fromJson(json: any): CartItem {
        const result = new CartItem();
        result.productId = json.productId;
        result.portionId = json.portionId;
        result.productName = new Map(Object.entries(json.productName));
        result.portionName = new Map(Object.entries(json.portionName));
        result.price = new Map(Object.entries(json.price));
        result.count = json.count;
        return result;
    }
}