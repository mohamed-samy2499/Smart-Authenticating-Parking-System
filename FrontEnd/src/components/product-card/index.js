import "./product-card.css";
import { useStores } from "../../hooks/useStores";

export const ProductCard = props => {
  const { authStore } = useStores();
  const { buyProduct } = authStore;
  const { price, title, disc, id, quantity } = props;
  return (
    // <div className="wrapper">
    <div className="outer">
      <div className="content animated fadeInLeft">
        <span className="bg animated fadeInDown">EXCLUSIVE</span>
        <h1>{title}</h1>
        <p>{disc}</p>
        <div>Quantity: {quantity}</div>

        <div className="button">
          <a href="#">{price}</a>
          <a className="cart-btn" href="#" onClick={() => buyProduct(1, id)}>
            <i className="cart-icon ion-bag"></i>Buy
          </a>
        </div>
      </div>
    </div>
    // </div>
  );
};
