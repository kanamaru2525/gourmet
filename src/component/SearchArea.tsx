import { Select, Button, Input,Option, Flex,Spacer,} from "@yamada-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

const SearchArea: React.FC = () => {
  const router = useRouter();

  // キーワード、緯度、経度の状態管理
  const [searchText, setSearchText] = useState<string>(Array.isArray(router.query.keyword) ? router.query.keyword[0] : router.query.keyword || ""); 
  const [latitude, setLatitude] = useState<string | null>(null);
  const [longitude, setLongitude] = useState<string | null>(null);
  const [range, setRange] = useState("3"); // 初期値を3に設定

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

 // 範囲選択の変更をハンドリング 
 const handleRangeChange =(value: string) => { 
  setRange(value);  // 直接値を設定 
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
    if (range) {
      query += `&range=${encodeURIComponent(range)}`;
    }
    router.push(`/search?${query}`);
  };

  return (
    <div>
      <Flex position="fixed" 
            top="0" 
            left="0"
            zIndex="10" 
            
            p={4} 
            align="center" 
            justify="space-between" 
            bg="white"
            w="100vw"
      >
        <Button as="a" href="/"  color="black" fontSize="xl" textAlign="center" variant="unstyled" >
          現在地からお店を調べるよサービス
        </Button>
      <Spacer />
        <Input 
          type="text" 
          value={searchText} 
          onChange={handleSearchInput} 
          placeholder="キーワード" 
          bg="white"
          width="md"
          />
       
          <Select id="range" value={range} onChange={handleRangeChange} bg="white" width="xxs"> 
          <Option value="1">300m</Option> 
          <Option value="2">500m</Option> 
          <Option value="3">1000m</Option> 
          <Option value="4">2000m</Option> 
          <Option value="5">3000m</Option> 
        </Select> 
        <Button type="button" onClick={handleSearch} bg="primary" color="white"> 
          検索する 
        </Button> 

      </Flex>
          </div>
  );
};

export default SearchArea;
