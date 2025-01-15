import axios from "axios";
import type { NextApiRequest,NextApiResponse } from "next";

export const SHOW_NUM = 10;

export default async function handler(
    req:NextApiRequest,
    res:NextApiResponse
) {
    
    /**
    * API_KEY関係
    */
    const API_KEY = process.env.NEXT_PUBLIC_HOTPEPPER_API_KEY;
    const API_URL = `http://webservice.recruit.co.jp/hotpepper/gourmet/v1/?key=${API_KEY}&format=json`
    /**
    * ページネーション関係
    */
   //1ページ辺りの取得数
    let API_Count = `&count=${SHOW_NUM}`;
        if (req.query.count) {
            API_Count = `&count=${req.query.count}`;
        }
    //検索開始位置
    let API_Num = "&start=1";
      if (req.query.startNum) {
        const resNum: any = req.query.startNum;
        const num = resNum * 10 - 9;
        API_Num = `&start=${num}`;
      }
    /**
    * 検索範囲 初期値3:1000m
    */
    let API_Range = "&range=3";
      if (req.query.range) {
        API_Range = `&range=${req.query.range}`;
      }
    /**
    * 経度緯度取得 初期値:東京駅の経度緯度
    */
    let API_Lat = "&lat=35.681236";
      if(req.query.lat){
        API_Lat = `&lat=${req.query.lat}`;
      }

    let API_Lng ="&lng=139.767125";
      if(req.query.lng){
        API_Lng = `&lng=${req.query.lng}`;
      }
    
    /**
    * キーワード検索
    */
    let API_Keyword = "";
    if (req.query.keyword) {
        API_Keyword = `&keyword=${req.query.keyword}`;
    }
    
    //結合処理
    try {
        const resData = await axios.get(
          `${API_URL}${API_Count}${API_Num}${API_Range}${API_Lat}${API_Lng}${API_Keyword}`
        );
        const ShopDate = resData.data.results;
        res.status(200).json(ShopDate);
        console.log("dataは出力してるよ～");
      } catch (err) {
        console.log(err);
      }
}