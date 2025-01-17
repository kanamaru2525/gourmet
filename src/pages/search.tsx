import SearchArea from "@/component/SearchArea";
import axios from "axios";
import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, useDisclosure } from "@yamada-ui/react";

export default function Search() {
  const [shopData, setShopData] = useState([]); // ショップリスト
  const [selectedShop, setSelectedShop] = useState<any>(null); // 選択されたショップデータ
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
      const res = await axios.get("/api/ShopDate", {
        params: {
          startNum: currentPage,
          range,
          lat,
          lng,
          keyword,
        },
      });
      setShopData(res.data.shop); // 取得したデータをセット
      setTotalPages(Math.ceil(res.data.results_available / 10));
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

  const handleOpenModal = (shop: any) => {
    setSelectedShop(shop); // 選択されたショップデータをセット
    onOpen(); // モーダルを開く
  };

  return (
    <div>
      <SearchArea />
      {shopData.length > 0 ? (
        <ul>
          {shopData.map((shop: any) => (
            <li key={shop.id}>
              <h3>
                <strong>{shop.name}</strong>
              </h3>
              <p>{shop.genre.name}</p>
              <p>{shop.access}</p>
              {shop.photo.pc.l ? (
                <Image src={shop.photo.pc.l} alt={shop.shopName} width={200} height={200} />
              ) : (
                <Image src="file.svg" alt="NO_IMAGE" width={200} height={200} />
              )}
              <Button onClick={() => handleOpenModal(shop)}>Open Modal</Button>
            </li>
          ))}
        </ul>
      ) : (
        <p>飲食店が見つかりませんでした。</p>
      )}
      {/* ページネーション */}
      <div>
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          前に戻る
        </button>
        <span>現在のページ: {currentPage}</span>
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          次へ進む
        </button>
      </div>

      {/* モーダル */}
      <Modal isOpen={isOpen} onClose={onClose}  size="6xl">
        <ModalHeader>{selectedShop?.name || "ショップ情報"}</ModalHeader>
        <ModalBody>
          {selectedShop ? (
            <>
              <p><strong>ジャンル:</strong> {selectedShop.genre.name}</p>
              <p><strong>住所:</strong> {selectedShop.address}</p>
              <p><strong>営業時間:</strong> {selectedShop.open}</p>
              {selectedShop.photo.pc.l ? (
                <Image src={selectedShop.photo.pc.l} alt={selectedShop.name} width={300} height={300} />
              ) : (
                <p>画像がありません</p>
              )}
            </>
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
