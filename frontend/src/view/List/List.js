import { Table, Button, message } from "antd";
import { useCallback, useEffect, useState } from "react";
import { DELETE_USER, FETCH_USER } from "../../services/authServices";
import moment from "moment";
import "./List.css";
import { DeleteOutlined, RetweetOutlined } from "@ant-design/icons";

function List() {
  const [filteredData, setFilteredData] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");
  const [deleteUserId, setDeleteUserId] = useState("");

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setDeleteUserId(selectedRowKeys);
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  const fetchData = async () => {
    const { data } = await FETCH_USER();
    console.log("data", data);

    if (data) {
      setFilteredData(data);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = useCallback(async (id) => {
    console.log("go");
    const { data } = await DELETE_USER(id);
    if (data) {
      message.success("User deleted successfully");
      fetchData();
    }
  }, []);

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      align: "center",
      render: (value, text, record) => (text ? `${text._id}` : "N/A"),
    },
    {
      title: "Username",
      dataIndex: "username",
      align: "center",
      render: (value, text, record) => (text ? `${text.username}` : "N/A"),
    },
    {
      title: "Email",
      dataIndex: "email",
      align: "center",
      render: (value, text, record) => (text ? `${text.email}` : "N/A"),
    },
    {
      title: "Register time",
      dataIndex: "registerDate",
      align: "center",
      render: (value, record) => {
        const registerDate = moment(record?.registerDate).format(
          "hh:mm DD.MM.YYYY "
        );
        return <span>{registerDate}</span>;
      },
    },
    {
      title: "Last login time",
      dataIndex: "lastLoginDate",
      align: "center",
      render: (value, record) => {
        const lastLoginDate = moment(record?.lastLoginDate).format(
          "hh:mm DD.MM.YYYY "
        );
        return <span>{lastLoginDate}</span>;
      },
    },
  ];
  return (
    <>
      <div className="list-btn-group">
        <Button
          type="primary"
          danger
          onClick={() => handleDelete(deleteUserId)}
          // link={`auth/users/delete${deleteUserId}`}
        >
          Block
        </Button>
        <RetweetOutlined style={{ fontSize: "27px", color: "blue" }} />
        <DeleteOutlined style={{ fontSize: "27px", color: "red" }} />
      </div>
      <Table
        rowSelection={{
          type: selectionType,
          ...rowSelection,
        }}
        size="small"
        rowKey="_id"
        dataSource={filteredData}
        columns={columns}
      />
    </>
  );
}
export default List;
