import Image from 'next/image';
import Link from 'next/link';
import style from './styles/BestItem.module.css';
import img_default from '@/public/img_default.png';

export default function BestItem({ products }) {

  return (
      <div className={style.bestItem}>
        {products.length > 0 ? (
          products.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id} className={style.bestSection}>
              <div>
                <Image className={style.img}
                // src={product.images.length > 0 ? product.images[0] : img_default} 
                src={img_default} 
                alt={product.name}
                onError={(e) => e.target.src = img_default} 
                width={300}
                height={300}
                priority
                />
                <p className={style.bestName}>{product.name}</p>
                <p className={style.bestPrice}>{product.price.toLocaleString()}원</p>
                <p className={style.bestFavoriteCount}>♡ {product.favoriteCount}</p>
              </div>
            </Link>
          ))
        ) : (
          <p>상품이 없습니다.</p> 
        )}
      </div>
  );
}