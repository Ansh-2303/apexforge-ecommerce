import { useEffect, useState } from "react"
import api from "../services/api"
import ProductCard from "../components/product/ProductCard"

const Wishlist = () => {

const [products,setProducts] = useState([])

useEffect(()=>{

const fetchWishlist = async () => {

try{

const {data} = await api.get("/wishlist")

setProducts(data)

}catch(err){
console.error(err)
}

}

fetchWishlist()

},[])

return (

<div className="container">

<h2>My Wishlist</h2>

<div className="products-grid">

{products.map(product=>(
<ProductCard key={product._id} product={product}/>
))}

</div>

</div>

)

}

export default Wishlist