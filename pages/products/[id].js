import style from "@/styles/ProductDetail.module.css";
import KebabMenu from "@/components/KebabMenu";
import Comment from "@/components/Comment";
import Image from "next/image";
import heart from "@/public/ic_heart.png";
import Spinner from "@/components/Spinner";
import { useRouter } from "next/router";
import { formatDate } from "@/utils/formatDate";
import { getProduct } from "@/pages/api/ProductService";
import { useEffect, useState } from "react";
import profile from "@/public/ic_profile.png";
import defaultImg from "@/public/img_default.png";

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const productData = await getProduct(id);
          setProduct(productData);
        } catch (error) {
          console.error(error.message);
        }
      }
    };
    fetchProduct();
  }, [id]);

  if (!product)
    return (
      <div className={style.loading}>
        <Spinner />
      </div>
    );

  return (
    <div className={style.container}>
      <div className={style.body}>
      <div className={style.productGroup}>
        <Image
          className={style.productImg}
          src={product.images[0] || defaultImg}
          alt="product"
          width={300}
          height={300}
        />
        <div className={style.productInfo}>
          <div className={style.productTop}>
            <p className={style.productName}>{product.name}</p>
            <KebabMenu className={style.kebab} />
          </div>
          <p className={style.productPrice}>{product.price}원</p>
          <span className={style.divider} />
          <div className={style.productDetail}>
            <p className={style.productDetailTitle}>상품 소개</p>
            <p className={style.productDetailContent}>{product.description}</p>
            <p className={style.tagTitle}>상품 태그</p>
            <div className={style.tagGroup}>
              {product.tags.map((tag, index) => (
                <div key={index} className={style.tag}>
                  # {tag}
                </div>
              ))}
            </div>
            <div className={style.user}>
              <div className={style.profileDate}>
                <Image
                  className={style.profileImg}
                  src={profile}
                  alt="profile"
                />
                <div className={style.nameDate}>
                  <p className={style.userName}>{product.ownerNickname}</p>
                  <p className={style.date}>{formatDate(product.createdAt)}</p>
                </div>
              </div>
              <div className={style.heart}>
                <Image src={heart} alt="heart" />
                <p>{product.favoriteCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span className={style.btmdivider} />
      <div className={style.comment}>
        <Comment />
      </div>
      </div>
    </div>
  );
}
