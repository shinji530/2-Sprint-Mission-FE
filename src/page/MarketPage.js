import { Fragment, useState, useEffect, useCallback } from "react";
import "../css/MarketPage.css";
import ic_arrow_down from "../assets/img/ic_arrow_down.png";
import ic_search from "../assets/img/ic_search.png";
import ic_sort from "../assets/img/ic_sort.png";
import BestItem from "../component/BestItem";
import ItemList from "../component/ItemList";
import { getProductList } from "../api/ProductService";
import Pagination from "../component/Pagination";
import { Link } from "react-router-dom";

const mobileSize = 743;
const tabletSize = 1199;
const MOBILE_PAGE_SIZE = 4;
const MOBIE_BEST_ITEM_SIZE = 1;
const TABLET_PAGE_SIZE = 6;
const TABLET_BEST_ITEM_SIZE = 2;
const DESKTOP_PAGE_SIZE = 10;
const DESKTOP_BEST_ITEM_SIZE = 4;

function MarketPage() {
  const [order, setOrder] = useState("favorite");
  const [products, setProducts] = useState([]);
  const [search, setSearch ] = useState("");
  const [bestItems, setBestItems] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [pageSize, setPageSize] = useState(DESKTOP_PAGE_SIZE);
  const [bestItemSize, setBestItemSize] = useState(DESKTOP_BEST_ITEM_SIZE);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= mobileSize) {
        setPageSize(MOBILE_PAGE_SIZE);
        setBestItemSize(MOBIE_BEST_ITEM_SIZE);
      } else if (window.innerWidth <= tabletSize) {
        setPageSize(TABLET_PAGE_SIZE);
        setBestItemSize(TABLET_BEST_ITEM_SIZE);
      } else {
        setPageSize(DESKTOP_PAGE_SIZE);
        setBestItemSize(DESKTOP_BEST_ITEM_SIZE);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // BestItem 데이터만 한 번 로드
  useEffect(() => {
    const fetchBestItems = async () => {
      const { data: productList } = await getProductList({
        orderBy: "favorite",
        pageSize: bestItemSize,
      });
      setBestItems(productList.sort((a, b) => b.favorite - a.favorite));
    };

    fetchBestItems();
  }, [bestItemSize]);

  const handleNewesClick = () => {
    setOrder("recent");
    setIsToggle(false);
    setCurrentPage(1);
  };

  const handleBestClick = () => {
    setOrder("favorite");
    setIsToggle(false);
    setCurrentPage(1);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setCurrentPage(1);
      handleGetProductList(order);
    }
  };

  const handlesearchChange = (e) => {
    setSearch(e.target.value);
  }

  const toggleSortMenu = () => setIsToggle(!isToggle);

  const handleGetProductList = useCallback(
    async (orderQuery) => {
      let queryParams = {
        orderBy: orderQuery,
        page: currentPage,
        pageSize: pageSize,
      };

      if (search) {
        queryParams.search = search;
      }

      const { data: productList, totalCount: fetchedTotalCount } =
        await getProductList(queryParams);
      setProducts(productList);
      setTotalCount(fetchedTotalCount);
      console.log(productList);
    },
    [search, currentPage, pageSize]
  );

  useEffect(() => {
    handleGetProductList(order);
  }, [order, search, currentPage, handleGetProductList]);

  return (
    <Fragment>
      <div className="market-section">
        <div className="best-section">
          <p className="best-title">베스트 상품</p>
          <BestItem products={bestItems} className="BestItem" />
        </div>
        <div className="item-section">
          <div className="item-search">
            <p className="item-title">판매 중인 상품</p>
            <div className="sort">
              <div className="search-group">
                <img className="search-icon" src={ic_search} alt="ic_search" />
                <input
                  className="search"
                  placeholder="검색할 상품을 입력해주세요"
                  value={search}
                  onChange={handlesearchChange}
                  onKeyDown={handleSearchKeyPress}
                ></input>
              </div>
              <Link to='/registration'><button className="item-register">상품 등록하기</button></Link>
              <div className="sort-menu">
                <button className="sort-toggle" onClick={toggleSortMenu}>
                  {pageSize === MOBILE_PAGE_SIZE ? (
                    <img src={ic_sort} alt="ic_sort"></img>
                  ) : (
                    <div className="sort-context">
                      {order === "favorite" ? <p>좋아요순</p> : <p>최신순</p>}
                      <img
                        className="arrow"
                        src={ic_arrow_down}
                        alt="ic_arrow_down"
                      />
                    </div>
                  )}
                </button>
                {isToggle && (
                  <div className="sort-options">
                    <button className="sort-button" onClick={handleNewesClick}>
                      최신순
                    </button>
                    <span />
                    <button className="sort-button" onClick={handleBestClick}>
                      좋아요순
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ItemList products={products} className="ItemList" />
        </div>
      </div>
      <Pagination
        className="Pagination"
        page={currentPage}
        setPage={setCurrentPage}
        totalCount={totalCount}
        pageSize={pageSize}
      />
    </Fragment>
  );
}

export default MarketPage;
