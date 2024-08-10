import { useNavigate, useParams } from "react-router-dom";
import { useGetProductQuery } from "../../features/api/apiSlice";
import { useEffect } from "react";

import { ROUTES } from "../../utils/routes";
import Product from "./Product";
import Products from "./Products";
import { useDispatch, useSelector } from "react-redux";
import { getRelatedProducts } from "../../features/products/productsSlice";

const SingleProduct = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();
  const { list, related } = useSelector(({ products }) => products);

  const { data, isLoading, isFetching, isSuccess } = useGetProductQuery({ id });
  console.log("product: ", data, isLoading, isFetching, isSuccess);
  // console.log("product data ", data.title);

  useEffect(() => {
    if (!isFetching && !isLoading && !isSuccess) {
      // если не изменяется store, не идет ответ на запрос и нет страницы (404 ошибка), то переходим на home
      navigate(ROUTES.HOME);
    }
  }, [isFetching, isLoading, isSuccess, navigate]);

  useEffect(() => {
    if (!data || !list.length) return; // ожидаем полной загрузки картинок
    if (data) {
      dispatch(getRelatedProducts(data.category.id));
      // console.log('related: ,', related)
    }
  }, [data, dispatch, list.length]);

  return !data ? (
    <section className="preloader">Loading...</section>
  ) : (
    <>
      <Product {...data} />
      <Products products={related} amount={5} title="Related products" />
    </>
  );
};

export default SingleProduct;
