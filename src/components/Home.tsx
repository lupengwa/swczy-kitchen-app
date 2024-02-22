import {IOrders} from "./IOrders";
import {useEffect, useState} from "react";
import {useFetch} from "use-http";
import {Box, Card, CardBody, CardFooter, CardHeader, Heading, SimpleGrid, Text, Checkbox, CheckboxGroup} from "@chakra-ui/react";

const Home = () => {
    const[orders, setOrders] = useState<IOrders>();
    const[orderCount, setOrderCount] = useState(new Map<number, number>());
    const colors = ['red', 'green', 'orange', 'purple', 'yellow', 'blue'];
    const {get, response, loading, error} = useFetch('./swczy-kitchen-app/data');

    useEffect(() => {loadData()},[]);
    const loadData = async () => {
        const initialValue: IOrders = await get('db.json');
        if (response.ok) {
            console.log('db data:'+initialValue);
            setOrders(initialValue);
            let orderMap = new Map<number, number>();
            initialValue.orders.forEach(order => orderMap.set(order.id, order.items.length));
            setOrderCount(orderMap);
        }
    }

    const handleCheck = (orderId: number) => {
        let curCount = orderCount.get(orderId);
        if(curCount !== undefined) {
            let updatedCount = curCount-1;
            if(updatedCount != 0) {
                orderCount.set(orderId, curCount - 1);
                setOrderCount(orderCount);
            } else {
                if(orders !== undefined) {
                    let updatedOrders = orders.orders.filter(order => order.id !== orderId);
                    const newOrders: IOrders = {orders: updatedOrders};
                    setOrders(newOrders);
                }
            }
        }
    }
    return (
        <Box>
            {orders?.orders.map((order, index) =>
                <SimpleGrid key={index} backgroundColor={colors[index]} m={20}  templateColumns='repeat(auto-fill, minmax(200px, 1fr))'>
                    <Heading>#{order.id}</Heading>
                    {order.items.map((item,idx) =>
                        <Card key={idx}>
                            <CardHeader>
                                <Heading size='md'> {item.short}</Heading>
                            </CardHeader>
                            <CardBody>
                                <Text>{item.name}</Text>
                            </CardBody>
                            <CardFooter>
                                <CheckboxGroup>
                                    <Checkbox key={idx} onChange={() => handleCheck(order.id)} size='lg'>
                                        Done
                                    </Checkbox>
                                </CheckboxGroup>
                            </CardFooter>
                        </Card>
                    )}
                </SimpleGrid>
            )}
        </Box>
    );
}

export default Home
