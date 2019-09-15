import OrderItem from "./OrderItem";

export default class Order {
    id: string;
    counter: number;
    orderItems: OrderItem[];
    state: string;
    
    static fromJson(json: any): Order {
        const result = new Order();
        result.id = json.id;
        result.counter = json.counter;
        result.orderItems = json.orderItems.map(OrderItem.fromJson);
        result.state = json.state;
        return result;
    }
}