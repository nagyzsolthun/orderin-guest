export default class OrderUpdate {
    orderId: string;
    state: string;

    static fromJson(json: any): OrderUpdate {
        const result = new OrderUpdate();
        result.orderId = json.orderId;
        result.state = json.state;
        return result;
    }
}