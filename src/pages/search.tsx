import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Search() {
  const [shopData, setShopData] = useState([]); //ショップリスト
  const router = useRouter();

  const { query } = router;
  const currentPage = query.page || 1; //現在のページ
  const range = query.range; //パラメータ 範囲
  const lat = query.lat; //パラメータ 経度
  const lng = query.lng; //パラメータ 緯度
  const areaCode = query.range; //パラメータ 範囲
  const keyword = query.keyword; //パラメータ キーワード
  console.log("確認1")
  // 初期ショップデータ取得関数
  const firstGetShop = async () => {
    try {
      
      setShopData([]);
      const res = await axios.get("/api/ShopDate", {
        params: {
          startNum: currentPage,
          areaCode,
          range,
          lat,
          lng,
          keyword,
        },
      });
      setShopData(res.data.shop); // 取得したデータをセット
      console.log("確認2");
    } catch (err) {
      console.log(err);
      }      
  };

  useEffect(() => {
    firstGetShop();
  }, [router.query]);

  return (
    <div>
      {shopData.length > 0 ? (
        <ul>
          {shopData.map((shop: any) => (
            <li key={shop.id}>
              <h3>{shop.name}</h3>
              <p>{shop.genre.name}</p>
              <p>{shop.address}</p>
              <p>{shop.tel}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>飲食店が見つかりませんでした。</p>
      )}
    </div>
  );
}
