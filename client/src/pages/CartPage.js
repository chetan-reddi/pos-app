import React, { useState, useEffect } from "react";
import DefaultLayout from "../components/DefaultLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  DeleteOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table, Form, Input, Select, message } from "antd";

const CartPage = () => {
  const [subTotal, setSubTotal] = useState(0);
  const [billPopup, setBillPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems } = useSelector((state) => state.rootReducer);

  //handle Increment function
  const handleIncrement = (record) => {
    dispatch({
      type: "UPDATE_CART",
      payload: { ...record, quantity: record.quantity + 1 },
    });
  };

  //handle Decrement function
  const handleDecrement = (record) => {
    if (record.quantity !== 1) {
      dispatch({
        type: "UPDATE_CART",
        payload: { ...record, quantity: record.quantity - 1 },
      });
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    {
      title: "Image",
      dataIndex: "image",
      render: (image, record) => (
        <img src={image} alt={record.name} height="60" width="60" />
      ),
    },
    { title: "Price", dataIndex: "price" },
    {
      title: "Quantity",
      dataIndex: "_id",
      render: (id, record) => (
        <div>
          <PlusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleIncrement(record)}
          />
          <b>{record.quantity}</b>
          <MinusCircleOutlined
            className="mx-3"
            style={{ cursor: "pointer" }}
            onClick={() => handleDecrement(record)}
          />
        </div>
      ),
    },
    {
      title: "Actions",
      dataIndex: "_id",
      render: (id, record) => (
        <DeleteOutlined
          style={{ cursor: "pointer" }}
          onClick={() =>
            dispatch({
              type: "DELETE_FROM_CART",
              payload: record,
            })
          }
        />
      ),
    },
  ];

  useEffect(() => {
    let temp = 0;
    cartItems.forEach((item) => (temp = temp + item.price * item.quantity));
    setSubTotal(temp);
  }, [cartItems]);

  //HandleSubmit
  const handleSubmit = async (value) => {
    try {
      const newObject = {
        ...value,
        cartItems,
        subTotal,
        tax: Number(((subTotal / 100) * 13).toFixed(2)),
        totalAmount: Number(
          Number(subTotal) + Number(((subTotal / 100) * 13).toFixed(2))
        ),
        userId: JSON.parse(localStorage.getItem("auth"))._id,
      };
      // console.log(newObject);
      await axios.post("/api/bills/add-bills", newObject);
      message.success("Bill Generated");
      navigate("/bills");
    } catch (error) {
      message.error("Something went wrong");
      console.log(error);
    }
  };

  return (
    <DefaultLayout>
      <h1> Cart Page</h1>
      <Table columns={columns} dataSource={cartItems} bordered />
      <div className="d-flex flex-column align-items-end">
        <hr />
        <h1>
          {" "}
          SUB TOTAL : $ <b>{subTotal.toFixed(2)}</b> /-{" "}
        </h1>
        <Button type="primary" onClick={() => setBillPopup(true)}>
          Create Invoice
        </Button>
        <Modal
          title="Create Invoice"
          visible={billPopup}
          onCancel={() => setBillPopup(false)}
          footer={false}
        >
          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item name="customerName" label="Customer Name"required="true">
              <Input />
            </Form.Item>
            <Form.Item name="customerNumber" label="Contact Number"required="true">
              <Input />
            </Form.Item>

            <Form.Item name="paymentMode" label="Payment Method"required="true">
              <Select>
                <Select.Option value="cash">Cash</Select.Option>
                <Select.Option value="card">Card</Select.Option>
              </Select>
            </Form.Item>

            <div className="bill-it">
              <h5>Sub Total : {subTotal.toFixed(2)}</h5>
              <h5>Tax : {((subTotal / 100) * 13).toFixed(2)}</h5>
              <h1>
                Total: $
                <b>
                  {(
                    Number(subTotal) +
                    Number(((subTotal / 100) * 13).toFixed(2))
                  ).toFixed(2)}
                </b>
              </h1>
            </div>
            <div className="d-flex justify-content-end">
              <Button type="primary" htmlType="submit">
                Generate Bill
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </DefaultLayout>
  );
};

export default CartPage;