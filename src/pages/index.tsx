import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const Home: React.FC = () => {
  const router = useRouter();

  // キーワード、緯度、経度の状態管理
  const [searchText, setSearchText] = useState(router.query.keyword || "");
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);

  // Geolocation APIを使用してユーザーの位置情報を取得
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString());
          setLongitude(position.coords.longitude.toString());
        },
        (error) => {
          console.error("位置情報の取得に失敗しました: ", error.message);
        }
      );
    } else {
      console.error("このブラウザは位置情報サービスをサポートしていません。");
    }
  }, []);

  // 入力テキストの変更をハンドリング
  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  // 検索ボタンがクリックされたときの処理
  const handleSearch = () => {
    let query = "";
    if (searchText) {
      query += `&keyword=${encodeURIComponent(searchText)}`;
    }
    if (latitude && longitude) {
      query += `&lat=${encodeURIComponent(latitude)}&lng=${encodeURIComponent(longitude)}`;
    }
    router.push(`/search?${query}`);
  };

  return (
    <div>
      <p>緯度: {latitude}</p>
      <p>経度: {longitude}</p>
      <input
        type="text"
        value={searchText}
        onChange={handleSearchInput}
        placeholder="キーワード"
      />
      <button type="button" onClick={handleSearch}>
        検索する
      </button>
    </div>
  );
};

export default Home;