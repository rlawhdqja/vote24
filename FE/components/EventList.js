import React, { useEffect, useState } from "react";
import Table from "./Table";
import TableRow from "./TableRow";
import TableColumn from "./TableColumn";
import axios from "axios";
import Link from "next/link";

const EVENT_URL = "https://teama205.iptime.org/api/event/947780";

const PostList = () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    const getList = async () => {
      const res = await axios.get(EVENT_URL);
      const data = res.data;
      setDataList(data);
    };
    getList();
  }, []);

  return (
    <div>
      <Table headersName={["글번호", "제목", "이벤트기한", "조회수"]}>
        {dataList
          ? dataList.map((item, index) => {
              return (
                <TableRow key={index}>
                  <TableColumn>{item.id}</TableColumn>
                  <TableColumn>
                    <Link href={`/notice/${item.id}`}>{item.title}</Link>
                  </TableColumn>
                  <TableColumn>{item.created_at}</TableColumn>
                  <TableColumn>{item.views}</TableColumn>
                </TableRow>
              );
            })
          : ""}
      </Table>
    </div>
  );
};

export default PostList;
