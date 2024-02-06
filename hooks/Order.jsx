import {createContext, useContext, useState} from "react";

const OrderContext = createContext({});


export const OrderProvider = ({children}) => {
    const [order, setOrder] = useState({
        id: '',
        customer_name: '',
        table_id: '',
        is_takeaway: false,
        products: [],
        notes: '',
        total_price: 0,
        payment_amount: 0,
        change_amount: 0
    })


    const reset = () => {
        setOrder({
            id: '',
            customer_name: '',
            table_id: '',
            is_takeaway: order.is_takeaway,
            products: [],
            notes: '',
            total_price: 0,
            payment_amount: 0,
            change_amount: 0
        })
    }

    return <OrderContext.Provider value={{order, setOrder, reset}}>
        {children}
    </OrderContext.Provider>
}

export const useOrder = () => {
    return useContext(OrderContext);
}
