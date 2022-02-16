import React, { useState, useEffect } from "react";
import DateForm from "../DateForm";
import TableRow from "../Table/TableRow";
import TableColumn from "../Table/TableColumn";
import axios from "axios";
import Vote24NoticeBtn from "./Vote24NoticeBtn";
import PagingFixed from "../../components/PagingFixed";

const ServiceNoticeList = ({ hospital_id, url }) => {
  const [dataList, setDataList] = useState([]);
  // 페이징 처리를 위한
  const [fixed, setFixed] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage] = useState(5);

  // 체크박스를 위한
  const [checkList, setCheckList] = useState([]);
  const [idList, setIdList] = useState([]);

  const headersName = ["번호", "제목", "생성일", "조회수"];
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const getList = async () => {
      await axios
        .get(url)
        .then((res) => {
          setDataList(res.data);
          console.log("서비스공지목록", res.data);
          setFixed(res.data.filter((data) => data.fixed == 1));
          console.log(
            "fixed data",
            res.data.filter((data) => data.fixed == 1)
          );
          let ids = [];
          {
            res.data &&
              res.data.slice(0, postsPerPage).map((item, i) => {
                ids[i] = item.id;
              });
          }
          setIdList(ids);
        })
        .catch((err) => {
          console.log("서비스 공지 목록 get 실패", err);
          router.push("/404");
        });
    };
    getList();
  }, [url]);

  // 페이징 처리를 위한 계산
  if (dataList.length) {
    const fixedCnt = fixed.length;
    const indexOfLastPost = currentPage * (postsPerPage - fixedCnt) + fixedCnt;
    const indexOfFirstPost = indexOfLastPost - postsPerPage + fixedCnt;
    const currentPosts = [
      ...dataList.slice(0, fixedCnt),
      ...dataList.slice(indexOfFirstPost, indexOfLastPost),
    ];
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
  }

  // 전체 선택/해제
  const onChangeAll = (e) => {
    setCheckList(e.target.checked ? idList : []);
  };

  const onChangeEach = (e, id) => {
    if (e.target.checked) {
      setCheckList([...checkList, id]);
    } else {
      setCheckList(checkList.filter((checkedId) => checkedId !== id));
    }
  };

  // 선택 삭제
  const handleRemove = () => {
    if (checkList.length) {
      checkList.map((noticeId) => {
        axios
          .delete(`${url}/${noticeId}`, {
            headers: {
              authorization: jwt,
            },
            data: {
              hospital_id: hospital_id,
            },
          })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log("삭제에러", error);
          });
        setIdList(dataList.filter((data) => data.id !== noticeId));
        setDataList((dataList) =>
          dataList.filter((data) => data.id !== noticeId)
        );
      });
    } else {
      return alert("삭제할 목록을 선택하세요.");
    }
  };

  return (
    <div>
      <Vote24NoticeBtn userId={hospital_id} handleRemove={handleRemove} />
      <table className="table">
        <thead>
          <tr>
            <th className="table-header-column">
              <input
                type="checkbox"
                onChange={onChangeAll}
                checked={checkList.length === idList.length}
              />
            </th>
            {headersName.map((item, index) => {
              return (
                <th className="table-header-column" key={index}>
                  {item}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {currentPosts
            ? currentPosts.map((item, index) => {
                return (
                  <TableRow key={index} id={item.id}>
                    <td className="table-column">
                      <input
                        type="checkbox"
                        onChange={(e) => onChangeEach(e, item.id)}
                        checked={checkList.includes(item.id)}
                      ></input>
                    </td>
                    <TableColumn
                      content={
                        index +
                        1 -
                        fixedCnt +
                        (currentPage - 1) * (postsPerPage - fixedCnt)
                      }
                      fixed={item.fixed}
                      url={`notice/${item.id}`}
                    ></TableColumn>
                    <TableColumn
                      content={item.title}
                      url={`notice/${item.id}`}
                    ></TableColumn>
                    <TableColumn
                      content={DateForm(item.created_at)}
                      url={`notice/${item.id}`}
                    ></TableColumn>
                    <TableColumn
                      content={item.views}
                      url={`notice/${item.id}`}
                    ></TableColumn>
                  </TableRow>
                );
              })
            : ""}
        </tbody>
      </table>
      <PagingFixed
        postsPerPage={postsPerPage}
        totalPosts={dataList.length}
        paginate={paginate}
        fixedCnt={fixedCnt}
      />
    </div>
  );
};

export default ServiceNoticeList;
