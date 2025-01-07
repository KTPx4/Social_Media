import axios from "axios";
import { useEffect, useState } from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const ProductList = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get('Products')
            .then(res => setProducts(res.data));
    }, []);

    return (
        <>
            <DataTable value={products} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} tableStyle={{ minWidth: '50rem' }}>
                <Column field="sku" header="Mã SP"></Column>
                <Column field="name" header="Tên SP"></Column>
                <Column field="price" header="Giá tiền"></Column>
                <Column field="stock" header="Tồn kho"></Column>
            </DataTable>
        </>
    );
}

export default ProductList;