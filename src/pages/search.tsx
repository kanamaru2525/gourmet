import SearchArea from "@/component/SearchArea";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Heading, Modal, ModalBody, ModalFooter, ModalHeader, useDisclosure, Wrap,Text, Card, CardBody, CardFooter, CardHeader, Center, Grid ,Box} from "@yamada-ui/react";

type Shop = {
  id: number;
  name: string;
  genre: {
    name: string;
  };
  access: string;
  photo: {
    pc: {
      l: string | null;
    };
  };
  address: string;
  budget:{
    name:string;
  }
  open: string;
  close:string;
};

export default function Search() {
  const [shopData, setShopData] = useState<Shop[]>([]); // ショップリスト
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null); // 選択されたショップデータ
  const router = useRouter();
  const [totalPages, setTotalPages] = useState(0); // 総ページ数

  const { query } = router;
  const currentPage = Number(query.page) || 1; // 現在のページを数値に変換
  const range = query.range; // パラメータ 範囲
  const lat = query.lat; // パラメータ 経度
  const lng = query.lng; // パラメータ 緯度
  const keyword = query.keyword; // パラメータ キーワード

  // 初期ショップデータ取得関数
  const firstGetShop = async () => {
    try {
      setShopData([]);
      const res = await axios.get<{ shop: Shop[], results_available: number }>("/api/ShopDate", {
        params: {
          startNum: currentPage,
          range,
          lat,
          lng,
          keyword,
        },
      });
      setShopData(res.data.shop); // 取得したデータをセット
      setTotalPages(Math.ceil(res.data.results_available / 12));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    firstGetShop();
  }, [router.query]);

  // ページリンクをクリックしたときにページを遷移
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      const updatedQuery = { ...query, page }; // 現在のクエリに新しいページ番号を追加
      const queryString = new URLSearchParams(updatedQuery as unknown as Record<string, string>).toString(); // クエリを文字列に変換
      router.push(`/search?${queryString}`); // 新しいURLに遷移
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure(); // useDisclosureを使用

  const handleOpenModal = (shop: Shop) => {
    setSelectedShop(shop); // 選択されたショップデータをセット
    onOpen(); // モーダルを開く
  };

  return (
    <div>
      <SearchArea />

      <Center  bgColor="primary">
      {shopData.length > 0 ? (
        <Wrap  gap="xl" margin="xl" padding="xl" >
          {shopData.map((shop: Shop) => (
            <Card key={shop.id} maxW="md" minW="md" mb="4" bgColor="white">
              <CardHeader display="flex" justifyContent="center" height="350px" padding="0" overflow="hidden" >
                {shop.photo.pc.l ? (
                  <Image
                    src={shop.photo.pc.l}
                    alt={shop.name}
                    width={300} 
                    height={300} 
                    objectFit="cover"

                  />
                ) : (
                  <Image
                    src="noimage.jpg"
                    alt="NO_IMAGE"
                    width={300} // 幅を数値で指定
                    height={300} // 高さも数値で指定
                    objectFit="fill"
                  />
                )}
              </CardHeader>

              <CardBody>
                <Heading size="md" mb="2">
                  <strong>{shop.name}</strong>
                </Heading>
                <Text mb="1"><strong>ジャンル:</strong> {shop.genre.name}</Text>

                <Text mb="-3"><strong>アクセス</strong></Text>
  
                <Text>{shop.access}</Text>
              </CardBody>

              <CardFooter>
                <Button colorScheme="primary" onClick={() => handleOpenModal(shop)}>
                  詳細
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Wrap>
      ) : (
        <Center h="90vh">
          <Text>飲食店が見つかりませんでした。</Text>
        </Center>
        
      )}
    </Center>
  <Center>
    {/* ページネーション */}
        <Button
          type="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ←
        </Button>
        <Text m="md">ページ: {currentPage}</Text>

        <Button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          →
        </Button>
  </Center>
    
      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}  size="6xl">
        <ModalHeader>{selectedShop?.name || "ショップ情報"}</ModalHeader>
        <ModalBody>
          {selectedShop ? (
            <Grid templateColumns="repeat(2, 1fr)" gap="xs">
              <Center>

              {selectedShop.photo.pc.l ? (
                <Image src={selectedShop.photo.pc.l} alt={selectedShop.name} width={300} height={300} />
              ) : (
                <Image
                    src="noimage.jpg"
                    alt="NO_IMAGE"
                    width={300} // 幅を数値で指定
                    height={300} // 高さも数値で指定
                  />
              )}
              </Center>
            
              <Box>
              <Text mb="1"><strong>ジャンル:</strong> {selectedShop.genre.name}</Text>
              <Text mb="1"><strong>住所:</strong> {selectedShop.address}</Text>
              <Text mb="1"><strong>予算:</strong> {selectedShop.budget.name}</Text>
              <Text mb="1"><strong>定休日:</strong> {selectedShop.close}</Text>
              <Text mb="1"><strong>営業時間:</strong> {selectedShop.open}</Text>
              </Box>
              
            </Grid>
          ) : (
            <p>ショップの詳細情報がありません。</p>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" onClick={onClose}>
            とじる
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
